import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates/features');

export async function applyFeature(feature: string, targetDir: string): Promise<void> {
  const featureDir = path.join(TEMPLATES_DIR, feature);
  const featureJsonPath = path.join(featureDir, 'feature.json');

  if (!(await fs.pathExists(featureJsonPath))) {
    throw new Error(`Feature "${feature}" not found`);
  }

  const featureConfig = await fs.readJson(featureJsonPath);

  await copyFeatureFiles(featureDir, targetDir, featureConfig.files);
  await replaceFeatureFiles(featureDir, targetDir, featureConfig.replaceFiles);
  await applyPackageChanges(targetDir, featureConfig.dependencies, featureConfig.scripts);
  await applyPatches(featureDir, targetDir);
}

async function replaceFeatureFiles(
  featureDir: string,
  targetDir: string,
  files: Record<string, Array<{ from: string; to: string }>>,
): Promise<void> {
  if (!files) return;

  for (const [pkg, fileMappings] of Object.entries(files)) {
    const pkgDir = pkg === 'backend' ? 'packages/backend' : 'packages/web';

    for (const { from, to } of fileMappings) {
      const src = path.join(featureDir, from);
      const dest = path.join(targetDir, pkgDir, to);

      if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
      }
    }
  }
}

async function copyFeatureFiles(
  featureDir: string,
  targetDir: string,
  files: Record<string, Array<{ from: string; to: string }>>,
): Promise<void> {
  if (!files) return;

  for (const [pkg, fileMappings] of Object.entries(files)) {
    const pkgDir = pkg === 'backend' ? 'packages/backend' : 'packages/web';

    for (const { from, to } of fileMappings) {
      const src = path.join(featureDir, pkg, from);
      const dest = path.join(targetDir, pkgDir, to);

      if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
      }
    }
  }
}

async function applyPackageChanges(
  targetDir: string,
  dependencies: Record<string, { add?: string[]; devAdd?: string[] }>,
  scripts?: Record<string, Record<string, string>>,
): Promise<void> {
  if (!dependencies && !scripts) return;

  for (const [pkg, deps] of Object.entries(dependencies || {})) {
    const pkgDir = pkg === 'backend' ? 'packages/backend' : 'packages/web';
    const pkgJsonPath = path.join(targetDir, pkgDir, 'package.json');

    if (!(await fs.pathExists(pkgJsonPath))) continue;

    const pkgJson = await fs.readJson(pkgJsonPath);

    if (deps.add) {
      pkgJson.dependencies = pkgJson.dependencies || {};
      for (const dep of deps.add) {
        pkgJson.dependencies[dep] = 'latest';
      }
    }

    if (deps.devAdd) {
      pkgJson.devDependencies = pkgJson.devDependencies || {};
      for (const dep of deps.devAdd) {
        pkgJson.devDependencies[dep] = 'latest';
      }
    }

    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }

  for (const [pkg, pkgScripts] of Object.entries(scripts || {})) {
    const pkgDir = pkg === 'backend' ? 'packages/backend' : 'packages/web';
    const pkgJsonPath = path.join(targetDir, pkgDir, 'package.json');

    if (!(await fs.pathExists(pkgJsonPath))) continue;

    const pkgJson = await fs.readJson(pkgJsonPath);

    pkgJson.scripts = pkgJson.scripts || {};
    for (const [name, script] of Object.entries(pkgScripts)) {
      pkgJson.scripts[name] = script;
    }

    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }
}

interface StringPatch {
  file: string;
  operations: Array<{
    type: 'replace';
    search: string;
    replace: string;
  }>;
}

async function applyPatches(featureDir: string, targetDir: string): Promise<void> {
  const patchesDir = path.join(featureDir, 'patches');

  if (!(await fs.pathExists(patchesDir))) return;

  const patchFiles = (await fs.readdir(patchesDir)).filter((f) => f.endsWith('.patch.json'));

  for (const patchFile of patchFiles) {
    const patchPath = path.join(patchesDir, patchFile);
    const patch = await fs.readJson(patchPath);
    await applyStringPatch(targetDir, patch);
  }
}

async function applyStringPatch(targetDir: string, patch: StringPatch): Promise<void> {
  const filePath = path.join(targetDir, patch.file);

  if (!(await fs.pathExists(filePath))) return;

  let content = await fs.readFile(filePath, 'utf-8');

  for (const op of patch.operations) {
    if (op.type === 'replace') {
      content = content.replace(op.search, op.replace);
    }
  }

  await fs.writeFile(filePath, content);
}
