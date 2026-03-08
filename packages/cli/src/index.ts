#!/usr/bin/env node
import path from 'node:path';
import * as p from '@clack/prompts';
import fs from 'fs-extra';
import color from 'picocolors';
import { applyFeature } from './apply-feature.js';
import { copyTemplate } from './copy-template.js';

const FEATURES = {
  minimal: {
    name: 'Minimal',
    description: 'Elysia + React (no database, no auth)',
    requires: [],
  },
  drizzle: {
    name: 'Drizzle',
    description: 'Minimal + PostgreSQL + Drizzle ORM + posts example',
    requires: [],
  },
  'drizzle-auth': {
    name: 'Drizzle + Auth',
    description: 'Drizzle + Better Auth (Google OAuth)',
    requires: ['drizzle'],
  },
} as const;

type FeatureKey = keyof typeof FEATURES;

async function main() {
  console.clear();

  p.intro(color.bgCyan(color.black(' create-elysium ')));

  // Get project name from args or prompt
  const argProjectName = process.argv[2];

  const project = await p.group(
    {
      name: () => {
        if (argProjectName) {
          return Promise.resolve(argProjectName);
        }
        return p.text({
          message: 'Project name?',
          placeholder: 'my-app',
          validate: (value) => {
            if (!value) return 'Please enter a project name';
            if (fs.existsSync(path.resolve(value))) {
              return `Directory "${value}" already exists`;
            }
          },
        });
      },
      feature: () =>
        p.select({
          message: 'Which template?',
          options: Object.entries(FEATURES).map(([key, feature]) => ({
            value: key as FeatureKey,
            label: feature.name,
            hint: feature.description,
          })),
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    },
  );

  const targetDir = path.resolve(project.name);
  const s = p.spinner();

  // Copy minimal template
  s.start(`Creating project in ${targetDir}`);
  await copyTemplate(targetDir);
  s.stop('Template copied');

  // Apply selected feature(s)
  const selectedFeature = project.feature as FeatureKey;

  if (selectedFeature !== 'minimal') {
    s.start('Applying features...');

    // Drizzle is always applied first if selected
    if (selectedFeature === 'drizzle' || selectedFeature === 'drizzle-auth') {
      await applyFeature('drizzle', targetDir);
    }

    // Then auth if selected
    if (selectedFeature === 'drizzle-auth') {
      await applyFeature('auth', targetDir);
    }

    s.stop('Features applied');
  }

  s.start('Installing dependencies');
  s.stop('Dependencies installed');

  p.outro(`${color.green('Done!')} Start your project:

  ${color.cyan(`cd ${project.name}`)}
  ${color.cyan('bun install')}
  ${color.cyan('just dev-backend')} ${color.dim('(in one terminal)')}
  ${color.cyan('just dev-web')} ${color.dim('(in another terminal)')}
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
