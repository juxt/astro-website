const fs = require('fs')
const { dirname } = require('path')
const path = require('path')
const YAML = require('yaml')
const MarkdownIt = require('markdown-it')

function parseSingleFile(fileName) {
  return new Promise((res, rej) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        rej('Error reading file', err)
      }

      let frontmatterRecord = {}
      const permalink = fileName.split('/').slice(-1)[0].split('.')[0]

      const md = MarkdownIt().use(
        require('markdown-it-front-matter'),
        function (fm) {
          const { author, category, title, description, tags, draft } =
            YAML.parse(fm)
          frontmatterRecord['author'] = author
          frontmatterRecord['category'] = category
          frontmatterRecord['title'] = title
          frontmatterRecord['description'] = description
          frontmatterRecord['permalink'] = permalink
          frontmatterRecord['tags'] = tags
          frontmatterRecord['draft'] = draft
        }
      )

      const parsedMd = md.parse(data)
      const contentRecords = parsedMd
        .filter(
          ({ type, tag, content }) =>
            type !== 'html_block' && tag !== 'code' && content.length
        )
        .map(({ content }) => ({
          permalink,
          content
        }))

      res([frontmatterRecord, ...contentRecords])
    })
  })
}

function parseAllFiles(dirName) {
  return new Promise((res, rej) => {
    fs.readdir(dirName, (err, files) => {
      if (err) {
        console.error(err)
        rej('Error reading directory', err)
      }

      const filteredFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ext === '.md' || ext === '.mdx'
      })

      const promises = filteredFiles.map((file) => {
        const fileName = `${dirName}/${file}`
        return parseSingleFile(fileName)
      })

      Promise.all(promises).then((data) => {
        const filteredDrafts = data.filter(
          ([frontmatter]) => !frontmatter.draft
        )

        const flattenedData = filteredDrafts.flat()
        res(flattenedData)
      })
    })
  })
}

module.exports = { parseSingleFile, parseAllFiles }
