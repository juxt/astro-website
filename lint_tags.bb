(ns lint-tags
  (:require
   [clojure.set :as set]
   [clj-yaml.core :as y]
   [clojure.java.io :as io]))

(def mdx-required-tags
  #{:author :title :category :publishedDate :heroImage})

(def mdx-optional-tags
  #{:tags :clojureIn :description})

(def md-required-tags
  (conj mdx-required-tags :layout))

(def md-optional-tags
  #{:draft :tags :clojureIn :description :metaTitle})

(def md-all-tags
  (set/union md-required-tags md-optional-tags))

(def mdx-all-tags
  (set/union mdx-required-tags mdx-optional-tags))

(defn validate-tags [f]
  (let [name    (.getName f)
        mdx?    (.endsWith name ".mdx")
        required (if mdx? mdx-required-tags md-required-tags)
        all      (if mdx? mdx-all-tags md-all-tags)
        parsed  (->> f
                     slurp
                     (re-find #"(?is)---(.*?)---")
                     last)
        tags    (-> parsed
                    y/parse-string
                    keys
                    set)]
    (assert (and
             (set/subset? required tags)
             (set/subset? tags all))
            {:required    required
             :file        name
             :actual-tags tags})))

(defn validate-all []
  (doseq [f (file-seq (io/file "src/pages/blog"))
          :when (and (.isFile f)
                     (or (.endsWith (.getName f) "md")
                         (.endsWith (.getName f) "mdx")))]
    (validate-tags f)))

(validate-all)
