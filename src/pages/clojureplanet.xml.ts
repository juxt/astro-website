import rss from '@astrojs/rss'
import { sortedPosts, postToItem } from '@utils/rss'

function isClojurePost(post) {
    const category = post.frontmatter.category.toLowerCase()
    const tags = (post.frontmatter.tags || []).map((tag) => tag.toLowerCase())
    return (
        category == 'clojure'
        || category == 'clojurescript'
        || category == 'clojure-in'
        || tags.includes('clojure')
        || tags.includes('clojurescript')
    );
}

export async function GET(context) {
    const posts = sortedPosts();

    return rss({
        title: 'JUXT Blog',
        description: 'JUXT is a UK based software firm and the creators of the bi-temporal graph database XTDB. This blog contains various posts written by our employees. The opinions expressed in the posts are those of the author, and not necessarily of JUXT.',
        site: context.site,
        items: posts
            .filter(isClojurePost)
            .map(postToItem),
        trailingSlash: false,
        customData:
          '<author><name>JUXT Ltd</name><email>info@juxt.pro</email></author>'
    });
}
