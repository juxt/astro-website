import { readdirSync } from 'fs'
import { basename } from 'path'

const blogDir = 'src/pages/blog'
const files = readdirSync(blogDir)

const uppercaseFiles = files.filter((file) => /[A-Z]/.test(file))

if (uppercaseFiles.length > 0) {
  console.error(
    'Error: Blog filenames must be lowercase to avoid URL canonicalization issues with Netlify.'
  )
  console.error('The following files have uppercase characters:')
  uppercaseFiles.forEach((file) => console.error(`  - ${blogDir}/${file}`))
  process.exit(1)
}

console.log('All blog filenames are lowercase.')
