#!/usr/bin/env node
import prompts from "prompts";
import { execa } from "execa";
import { existsSync } from "fs";

async function main() {
  // Demander le nom du projet
  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    initial: "deesse-app"
  });

  const projectName = response.projectName.trim();
  if (!projectName) {
    console.error("❌ Project name is required.");
    process.exit(1);
  }

  if (existsSync(projectName)) {
    console.error(`❌ Folder "${projectName}" already exists.`);
    process.exit(1);
  }

  console.log(`📦 Creating project "${projectName}"...`);

  // ✅ clone avec git
  await execa("git", [
    "clone",
    "https://github.com/DevelopersSecrets/DeesseJS.git",
    projectName
  ], { stdio: "inherit" });

  // Installation des dépendances
  console.log("📥 Installing dependencies...");
  try {
    await execa("pnpm", ["install"], { cwd: projectName, stdio: "inherit" });
  } catch {
    console.log("⚠️ pnpm not found, trying npm...");
    await execa("npm", ["install"], { cwd: projectName, stdio: "inherit" });
  }

  console.log(`
✅ Project ready!

Next steps:
  cd ${projectName}
  cp .env.example .env
  pnpm dev

👉 Admin: http://localhost:3000/admin
`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
