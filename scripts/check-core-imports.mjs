#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = join(process.cwd(), 'src/core')
const skipDirs = new Set(['node_modules'])
const sourceExt = /\.(ts|tsx)$/

const forbidden = [
  /from\s+['"]react(?:-dom)?['"]/,
  /from\s+['"]react(?:-dom)?\//,
  /from\s+['"][^'"]*\/ui(?:\/[^'"]*)?['"]/,
  /from\s+['"]src\/ui(?:\/[^'"]*)?['"]/,
]

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      await walk(path, files)
      continue
    }
    if (sourceExt.test(entry.name)) files.push(path)
  }
  return files
}

let files = []
try {
  files = await walk(root)
} catch (error) {
  if (error && error.code === 'ENOENT') {
    console.log('ok: src/core has no TypeScript files yet')
    process.exit(0)
  }
  throw error
}

const hits = []
for (const file of files) {
  const text = await readFile(file, 'utf8')
  if (forbidden.some((pattern) => pattern.test(text))) {
    hits.push(relative(process.cwd(), file).replaceAll('\\', '/'))
  }
}

if (hits.length) {
  console.error('src/core must not import react or src/ui:')
  for (const file of hits) console.error(`  ${file}`)
  process.exit(1)
}

console.log(`ok: ${files.length} core files, no ui/react imports`)
