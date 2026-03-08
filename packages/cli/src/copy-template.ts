import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILES_TO_COPY = [
  'package.json',
  'tsconfig.json',
  'tsconfig.base.json',
  'biome.json',
  'justfile',
  'README.md',
  '.gitignore',
  'packages/backend/package.json',
  'packages/backend/tsconfig.json',
  'packages/backend/src/index.ts',
  'packages/backend/src/env.ts',
  'packages/backend/src/routes/index.ts',
  'packages/backend/src/lib/errors.ts',
  'packages/backend/src/lib/models.ts',
  'packages/backend/src/modules/health/index.ts',
  'packages/backend/.env.example',
  'packages/web/package.json',
  'packages/web/tsconfig.json',
  'packages/web/vite.config.ts',
  'packages/web/index.html',
  'packages/web/components.json',
  'packages/web/src/main.tsx',
  'packages/web/src/config/env.ts',
  'packages/web/src/config/router.tsx',
  'packages/web/src/routes/index.tsx',
  'packages/web/src/routes/root.tsx',
  'packages/web/src/pages/index.tsx',
  'packages/web/src/components/app-wrapper.tsx',
  'packages/web/src/components/hero-section.tsx',
  'packages/web/src/components/root-layout.tsx',
  'packages/web/src/layouts/app-layout.tsx',
  'packages/web/src/hooks/use-mobile.ts',
  'packages/web/src/lib/client.ts',
  'packages/web/src/lib/query-client.ts',
  'packages/web/src/lib/utils.ts',
  'packages/web/src/reportWebVitals.ts',
  'packages/web/.env.example',
];

const UI_COMPONENTS = [
  'alert-dialog.tsx',
  'avatar.tsx',
  'button.tsx',
  'card.tsx',
  'code-block.tsx',
  'dialog.tsx',
  'dropdown-menu.tsx',
  'field.tsx',
  'input.tsx',
  'label.tsx',
  'separator.tsx',
  'sheet.tsx',
  'skeleton.tsx',
  'sonner.tsx',
  'spinner.tsx',
  'table.tsx',
  'textarea.tsx',
  'tooltip.tsx',
  'sidebar.tsx',
];

export async function copyTemplate(targetDir: string): Promise<void> {
  const packagesDir = path.resolve(__dirname, '../../../packages');

  await fs.ensureDir(targetDir);

  for (const file of FILES_TO_COPY) {
    const src = path.resolve(packagesDir, '../', file);
    const dest = path.resolve(targetDir, file);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
    }
  }

  for (const component of UI_COMPONENTS) {
    const src = path.resolve(packagesDir, 'web/src/components/ui', component);
    const dest = path.resolve(targetDir, 'packages/web/src/components/ui', component);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
    }
  }

  const publicSrc = path.resolve(packagesDir, 'web/public');
  const publicDest = path.resolve(targetDir, 'packages/web/public');
  if (await fs.pathExists(publicSrc)) {
    await fs.copy(publicSrc, publicDest);
  }

  const fontsSrc = path.resolve(packagesDir, 'web/src/assets/fonts');
  const fontsDest = path.resolve(targetDir, 'packages/web/src/assets/fonts');
  if (await fs.pathExists(fontsSrc)) {
    await fs.copy(fontsSrc, fontsDest);
  }
}
