// TODO: convert to using content collections when/if we migrate
export function sortedPosts() {
    const postImportResult = import.meta.glob('../../pages/blog/{*.mdx,*.md}', { eager: true }); 
    const posts = Object.values(postImportResult);
    return posts
        .sort((a, b) => {
          return (
              new Date(b.frontmatter.publishedDate).getTime() -
              new Date(a.frontmatter.publishedDate).getTime()
          )
        })
        .filter((post) => !post.frontmatter.draft);
}

export function postToItem(post) {
    return {
        link: post.url,
        title: post.frontmatter.title,
        pubDate: post.frontmatter.publishedDate,
        description: post.frontmatter.description,
    };
}
