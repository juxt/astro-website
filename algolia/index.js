const algoliasearch = require('algoliasearch')
const dotenv = require('dotenv')
const path = require('path')
const { parseAllFiles } = require('./md-parser')

dotenv.config()

async function index() {
  try {
    const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID
    const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY
    const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

    const index = client.initIndex(ALGOLIA_INDEX_NAME)

    const newObjects = await parseAllFiles(`${__dirname}/../src/pages/blog/`)

    await index.setSettings({
      attributeForDistinct: 'permalink',
      attributesForFaceting: [
        'tags',
        'searchable(tags)',
        'author',
        'searchable(author)',
        'category',
        'searchable(category)'
      ]
    })

    await index.clearObjects()

    const { taskIDs, objectIDs } = await index.saveObjects(newObjects, {
      autoGenerateObjectIDIfNotExist: true
    })

    console.log('Algolia Task IDs:', taskIDs)
    console.log('Indexed Records:', objectIDs.length)
  } catch (err) {
    console.error(err)
  }
}

index()
