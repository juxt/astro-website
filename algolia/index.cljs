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

;; evn vars are stored in netlify
(def ALGOLIA_APP_ID (-> js/process .-env .-ALGOLIA_APP_ID))
(def ALGOLIA_API_KEY (-> js/process .-env .-ALGOLIA_API_KEY))
(def ALGOLIA_INDEX_NAME (-> js/process .-env .-ALGOLIA_INDEX_NAME))

(algoliasearch ALGOLIA_APP_ID ALGOLIA_API_KEY)

(defn str-random-uuid [] (str (random-uuid)))

;; to locally test with repl
(defmacro defp [binding expr]
  `(-> ~expr (.then (fn [val]
                      (def ~binding val)))))

(defn load-md [file-name]
  (-> (slurp file-name)
      (.then (fn [val] val))
      (.catch (fn [_]))))

(def people (atom {}))

(defn extract-person [path]
  (p/let [loaded-md (load-md path)
          md-it (.use (markdown-it.)
                      md-frontmatter
                      (fn [fm]
                        (p/let [md-frontmatter (.parse YAML fm)
                                code (g/get md-frontmatter "code")
                                name (g/get md-frontmatter "name")
                                lastName (g/get md-frontmatter "lastName")]
                          (swap! people assoc code {:firstName name :lastName lastName}))))]
    (.parse md-it loaded-md #js {})))

(defn parse-people [path]
  (p/let [all-files (glob path)]
    (js/Promise.all (.map all-files extract-person))))

;; when working from repl, change both paths to "./src/.."
(def blog-files-path "../src/pages/blog/{*.md,*.mdx}")
(def people-path "../src/data/people/{*.md,*.mdx}")

(await (parse-people people-path))

(defn file-name->permalink
  [file-name]
  (-> (string/split file-name "/")
      (last)
      (string/split #"\.")
      (first)))

(defn frontmatter-callback
  [permalink frontmatter-record]
  (fn [fm]
    (let [md-frontmatter (.parse YAML fm)
          author (g/get md-frontmatter "author")
          {:keys [firstName lastName]} (get @people author)
          category (g/get md-frontmatter "category")
          title (g/get md-frontmatter "title")
          description (g/get md-frontmatter "description")
          tags (g/get md-frontmatter "tags")
          draft (g/get md-frontmatter "draft")
          publishedDate (g/get md-frontmatter "publishedDate")
          timestamp (js/Math.floor (/ (.getTime (js/Date. publishedDate)) 1000))]
      (reset! frontmatter-record
              {:draft? draft
               :record #js {"author" (if (= author "juxt")
                                       "juxt"
                                       (str firstName " " lastName))
                            "category" category
                            "title" title
                            "timestamp" timestamp
                            "objectID" (str-random-uuid)
                            "description" description
                            "permalink" permalink
                            "tags" tags}}))))

(defn parse-md-file [file-name]
  (p/let [loaded-md (load-md file-name)]
    (when loaded-md
      (p/let [frontmatter-record (atom nil)
              permalink (file-name->permalink file-name)
              md-it (.use (markdown-it.)
                          md-frontmatter
                          (frontmatter-callback
                           permalink frontmatter-record))
              md-paragraphs (.parse md-it loaded-md #js {})
              draft? (:draft? @frontmatter-record)
              filtered-md-paragraphs (when (not draft?)
                                       (.filter md-paragraphs
                                                (fn [paragraph]
                                                  (let [type (g/get paragraph "type")
                                                        tag (g/get paragraph "tag")
                                                        content (g/get paragraph "content")]
                                                    (and
                                                     (not= type "html_block")
                                                     (not= tag "code")
                                                     (not (string/blank? content)))))))
              partitioned-md-paragraphs (partition-all 2 filtered-md-paragraphs)
              timestamp (g/get (:record @frontmatter-record) "timestamp")
              records (reduce
                       (fn [coll blocks]
                         ;; group blocks into the same record to avoid hitting 
                         ;; the Algolia API rate limit
                         (let [blockCount (count blocks)
                               content (if (= blockCount 1)
                                         (g/get (first blocks) "content")
                                         (->> blocks
                                              (map (fn [block]
                                                     (g/get block "content")))
                                              (string/join " ")))]
                           (doto coll
                             (.push #js {"objectID" (str-random-uuid)
                                         "content" content
                                         "timestamp" timestamp
                                         "permalink" permalink}))))
                       #js []
                       partitioned-md-paragraphs)]
        (when (> (count records) 0)
          (doto records
            (.push
             (:record @frontmatter-record))))))))

(defn retrieve-file-names [path]
  (p/let [all-files (glob path)]
    {:file-names all-files}))

(defn parse-md-files [path]
  (p/let [{:keys [file-names]} (retrieve-file-names path)
          ;; draft blogs are excluded!!
          records (js/Promise.all (.map file-names parse-md-file))
          filtered (.filter records #(some? %))
          flattened (.flat filtered)]
    {:flattened flattened
     :filtered filtered}))

(def client (algoliasearch ALGOLIA_APP_ID ALGOLIA_API_KEY))
(def index (.initIndex client ALGOLIA_INDEX_NAME))

(println "Parsing blog articles...")

(def records (await (parse-md-files blog-files-path)))

(println "Blog articles successfully parsed.")
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

(defn clearFullIndexContent []
  (await (index.clearObjects))
  (println "Deleted full index content."))

(clearFullIndexContent)

(def storedObjects (await (index.saveObjects
                           (:flattened records))))

(println "Stored" (count (g/get storedObjects "objectIDs")) "new records successfully")
(println "Task IDs:" (g/get storedObjects "taskIDs"))
(println "Done!")
