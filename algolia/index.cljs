(ns index
  (:require ["algoliasearch$default" :as algoliasearch]
            ["dotenv" :as dotenv]
            ["yaml" :as YAML]
            ["zx" :refer [glob]]
            [nbb.core :refer [slurp await]]
            ["markdown-it$default" :as markdown-it]
            ["markdown-it-front-matter$default" :as md-frontmatter]
            [promesa.core :as p]
            [goog.object :as g]
            [clojure.string :as string]))

(.config dotenv)

(def ALGOLIA_APP_ID (-> js/process .-env .-ALGOLIA_APP_ID))
(def ALGOLIA_API_KEY (-> js/process .-env .-ALGOLIA_API_KEY))
(def ALGOLIA_INDEX_NAME (-> js/process .-env .-ALGOLIA_INDEX_NAME))

(algoliasearch ALGOLIA_APP_ID ALGOLIA_API_KEY)

(defn str-random-uuid [] (str (random-uuid)))

;; to locally test with repl
(defmacro defp [binding expr]
  `(-> ~expr (.then (fn [val]
                      (def ~binding val)))))

(defn file-name->permalink
  [file-name]
  (-> (string/split file-name "/")
      (last)
      (string/split #"\.")
      (first)))

(def args (not-empty (js->clj (.slice js/process.argv 3))))

(def partial-indexing? (= "--partial" (first args)))

(defn frontmatter-callback
  [permalink frontmatter-record]
  (fn [fm]
    (let [md-frontmatter (.parse YAML fm)
          author (g/get md-frontmatter "author")
          category (g/get md-frontmatter "category")
          title (g/get md-frontmatter "title")
          description (g/get md-frontmatter "description")
          tags (g/get md-frontmatter "tags")
          draft (g/get md-frontmatter "draft")
          publishedDate (g/get md-frontmatter "publishedDate")
          timestamp (js/Math.floor (/ (.valueOf (js/Date. publishedDate)) 1000))]
      (reset! frontmatter-record
              {:draft? draft
               :record #js {"author" author
                            "category" category
                            "title" title
                            "timestamp" timestamp
                            "objectID" (str-random-uuid)
                            "description" description
                            "permalink" permalink
                            "tags" tags}}))))

(defn parse-md-file [file-name]
  (p/let [loaded-md  (-> (slurp file-name)
                         (.then (fn [val] val))
                         (.catch (fn [_])))]
    (when loaded-md
      (p/let [frontmatter-record (atom nil)
              permalink (file-name->permalink file-name)
              md-it (.use (markdown-it.) 
                          md-frontmatter
                          (frontmatter-callback
                           permalink frontmatter-record))
              md-paragraphs (.parse md-it loaded-md #js {})
              draft? (:draft? @frontmatter-record)
              timestamp (g/get (:record @frontmatter-record) "timestamp")
              records (when (not draft?)
                        (.reduce md-paragraphs
                                 (fn [coll paragraph]
                                   (let [type (g/get paragraph "type")
                                         tag (g/get paragraph "tag")
                                         content (g/get paragraph "content")]
                                     (if (and
                                          (not draft?)
                                          (not= type "html_block")
                                          (not= tag "code")
                                          (not (string/blank? content)))
                                       (doto coll
                                         (.push #js {"objectID" (str-random-uuid)
                                                     "content" content
                                                     "timestamp" timestamp
                                                     "permalink" permalink}))
                                       coll))) #js []))]
        (when (> (count records) 0)
          (doto records
            (.push
             (:record @frontmatter-record))))))))

(def blog-files-path "../src/pages/blog/{*.md,*.mdx}")

(defn is-blog [file-str]
  (re-find #"blog/.*\.md" file-str))

(defn changed-files [files-coll]
  (->> files-coll
       (reduce
        (fn [coll file-name]
          (if (is-blog file-name)
            (-> coll
                (update :changed-files
                        #(doto % (.push (str "../" file-name))))
                (update :files-to-remove conj
                        (file-name->permalink file-name)))
            coll))
        {:changed-files #js []
         :files-to-remove #{}})))

(defn retrieve-file-names [path]
  (p/let [all-files (glob path)
          {:keys [changed-files files-to-remove]}
          (changed-files (rest args))]
    (when partial-indexing?
      (println "Blog articles to update:" changed-files))
    {:file-names (if partial-indexing? changed-files all-files)
     :files-to-remove (if partial-indexing? files-to-remove #{})}))

(defn parse-md-files [path]
  (p/let [{:keys [file-names files-to-remove]} (retrieve-file-names path)
          ;; draft blogs are excluded!!
          records (js/Promise.all (.map file-names parse-md-file))
          filtered (.filter records #(some? %))
          flattened (.flat filtered)]
    {:flattened flattened
     :filtered filtered
     :files-to-remove files-to-remove}))

(def client (algoliasearch ALGOLIA_APP_ID ALGOLIA_API_KEY))
(def index (.initIndex client ALGOLIA_INDEX_NAME))

(println "Parsing blog articles...")

(def records (await (parse-md-files blog-files-path)))

(println "Blog articles successfully parsed.")
(println "Blog articles to remove:" (:files-to-remove records))
(println "Blog articles to index:" (count (:filtered records)))

(await (index.setSettings
        #js {"attributeForDistinct" "permalink"
             "attributesForFaceting"
             #js ["tags"
                  "searchable(tags)"
                  "author"
                  "searchable(author)"
                  "category"
                  "searchable(category)"
                  "permalink"
                  "filterOnly(permalink)"]
             "replicas" #js ["blog_desc"]
             "ranking" #js ["desc(timestamp)"]}))

(defn retrieve-obj-ids-to-be-deleted
  [files-to-remove]
  (p/let [search-results
          (p/all (map
                  (fn [permalink]
                    (index.search
                     permalink
                     #js {"filters"
                          (str "permalink:" permalink)}))
                  files-to-remove))]
    (reduce
     (fn [coll search-result]
       (let [hits (g/get search-result "hits")]
         (if (seq hits)
           (apply conj coll
                  (map
                   (fn [hit]
                     (g/get hit "objectID"))
                   hits))
           coll)))
     #{}
     search-results)))

(def objects-ids-to-be-deleted (await (retrieve-obj-ids-to-be-deleted
                                       (:files-to-remove records))))


(defn clearChangedContent []
  (await (index.deleteObjects
          (clj->js objects-ids-to-be-deleted)))
  (println "Deleted" (count objects-ids-to-be-deleted) "records from Algolia."))

(defn clearFullIndexContent []
  (await (index.clearObjects))
  (println "Deleted full index content."))

(if partial-indexing?
  (clearChangedContent)
  (clearFullIndexContent))

(def storedObjects (await (index.saveObjects
                           (:flattened records))))

(println "Stored" (count (g/get storedObjects "objectIDs")) "new records successfully")
(println "Task IDs:" (g/get storedObjects "taskIDs"))
(println "Done!")
