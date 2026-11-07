#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = process.cwd()
const skipDirs = new Set(['node_modules', 'dist', '.git'])

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      await walk(join(dir, entry.name), files)
      continue
    }
    files.push(join(dir, entry.name))
  }
  return files
}

function toPosix(path) {
  return relative(root, path).replaceAll('\\', '/')
}

function isSkill(path) {
  return (
    /(^|\/)\.cursor\/skills\/[^/]+\/SKILL\.md$/.test(path) ||
    /(^|\/)\.agents\/skills\/[^/]+\/SKILL\.md$/.test(path)
  )
}

const indexPath = join(root, 'AGENTS.md')
const index = await readFile(indexPath, 'utf8')
const files = (await walk(root)).map(toPosix)

const nestedAgents = files.filter(
  (path) => path.endsWith('/AGENTS.md') && path !== 'AGENTS.md',
)
const skills = files.filter(isSkill)
const required = [...nestedAgents, ...skills]

const missing = required.filter((path) => !index.includes(path))
const listed = [...index.matchAll(/[\w./-]+(?:AGENTS\.md|SKILL\.md)/g)].map(
  (match) => match[0],
)
const stale = listed.filter(
  (path) => path !== 'AGENTS.md' && !files.includes(path),
)

if (missing.length || stale.length) {
  if (missing.length) {
    console.error('Root AGENTS.md does not mention:')
    for (const path of missing) console.error(`  + ${path}`)
  }
  if (stale.length) {
    console.error('Root AGENTS.md points at missing files:')
    for (const path of stale) console.error(`  - ${path}`)
  }
  process.exit(1)
}

console.log(
  `ok: ${nestedAgents.length} nested AGENTS.md, ${skills.length} skills indexed`,
)
