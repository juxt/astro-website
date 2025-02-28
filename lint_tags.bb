(ns lint-tags
  (:require
   [clojure.set :as set]
   [clj-yaml.core :as y]
   [clojure.java.io :as io]))

(def required-tags
  #{:author :title :category :layout :publishedDate :heroImage})

(def optional-tags
  #{:draft :tags :clojureIn :description :metaTitle})

(def all-tags
  (set/union required-tags optional-tags))

(defn validate-tags [f]
  (let [parsed (->> f
                    slurp
                    (re-find #"(?is)---(.*?)---")
                    last)
        tags   (-> parsed
                   y/parse-string
                   keys
                   set)]
    (assert (and
             (set/subset? required-tags tags)
             (set/subset? tags all-tags))
            {:required    required-tags
             :file        (.getName f)
             :actual-tags tags})))


(defn validate-all []
  (doseq [f (file-seq (io/file "src/pages/blog"))
          :when (and (.isFile f)
                     (or (.endsWith (.getName f) "md")
                         (.endsWith (.getName f) "mdx")))]
    (validate-tags f)))

(validate-all)
