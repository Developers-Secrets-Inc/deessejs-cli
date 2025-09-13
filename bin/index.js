#!/usr/bin/env node
import { giget } from 'giget'
import prompts from 'prompts'
import { execa } from 'execa'
import { existsSync } from 'fs'

async function main() {
  // Demande le nom du projet
  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: 'deesse-app',
  })

  const projectName = response.projectName.trim()
  if (!projectName) {
    console.error('❌ Project name is required.')
    process.exit(1)
  }

  if (existsSync(projectName)) {
    console.error(`❌ Folder "${projectName}" already exists.`)
    process.exit(1)
  }

  console.log(`📦 Creating project "${projectName}"...`)

  // Clone du template
  await giget('github:DevelopersSecrets/DeesseJS', {
    dir: projectName,
    force: true,
  })

  // Installation des dépendances
  console.log('📥 Installing dependencies...')
  try {
    await execa('pnpm', ['install'], { cwd: projectName, stdio: 'inherit' })
  } catch {
    console.log('⚠️ pnpm not found, trying npm...')
    await execa('npm', ['install'], { cwd: projectName, stdio: 'inherit' })
  }

  // Message final
  console.log(`
✅ Project ready!

Next steps:
  cd ${projectName}
  cp .env.example .env
  pnpm dev

👉 Admin is available at http://localhost:3000/admin
`)
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
