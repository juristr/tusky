import { Tree, createProjectGraphAsync } from '@nx/devkit';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';
import { join } from 'path';

export async function updateTailwindGlobsGenerator(
  tree: Tree
): Promise<SyncGeneratorResult> {
  const appName = '@tusky/shop';

  const projectGraph = await createProjectGraphAsync();
  const shopProject = projectGraph.nodes[appName];

  if (!shopProject) {
    return {
      outOfSyncMessage: 'Shop project not found in project graph',
    };
  }

  // Get all dependencies of the shop app
  const dependencies = new Set<string>();
  const queue = [appName];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (visited.has(current)) continue;
    visited.add(current);

    const deps = projectGraph.dependencies[current] || [];
    deps.forEach((dep) => {
      dependencies.add(dep.target);
      queue.push(dep.target);
    });
  }

  // Generate @source directives for each dependency
  const sourceDirectives: string[] = [];

  // Add patterns for each dependency
  dependencies.forEach((dep) => {
    const project = projectGraph.nodes[dep];
    if (project && project.data.root) {
      const relativePath = join('../../../', project.data.root);
      sourceDirectives.push(`@source "${relativePath}";`);
    }
  });

  // Sort for consistency
  sourceDirectives.sort();

  // Read current styles.css
  const stylesPath = 'apps/shop/src/styles.css';
  const currentContent = tree.read(stylesPath)?.toString() || '';

  // Find where to insert the @source directives (after @import "tailwindcss"; or @import 'tailwindcss';)
  const importRegex = /@import\s+['"]tailwindcss['"];/;
  const importMatch = currentContent.match(importRegex);
  if (!importMatch) {
    return {
      outOfSyncMessage:
        'Could not find @import "tailwindcss"; or @import \'tailwindcss\'; in styles.css',
    };
  }
  // Extract existing @source directives (handle both quote styles)
  const sourceRegex = /@source\s+["'][^"']+["'];/g;
  const existingSourcesMatch = currentContent.match(sourceRegex) || [];
  const existingSources = new Set(existingSourcesMatch.map((s) => s.trim()));

  // Check if we need to update
  const needsUpdate =
    sourceDirectives.length !== existingSources.size ||
    sourceDirectives.some((directive) => !existingSources.has(directive));

  if (needsUpdate) {
    // Remove all existing @source directives
    let cleanedContent = currentContent;

    // Remove @source lines (including newlines)
    cleanedContent = cleanedContent.replace(/\n@source\s+["'][^"']+["'];/g, '');

    // Find the import line again in cleaned content
    const cleanImportMatch = cleanedContent.match(importRegex);
    const cleanImportEndIndex =
      cleanedContent.indexOf('\n', cleanImportMatch!.index!) + 1;

    // Insert new @source directives after the import
    const beforeImport = cleanedContent.substring(0, cleanImportEndIndex);
    const afterImport = cleanedContent.substring(cleanImportEndIndex);

    // Add source directives with proper formatting
    const sourcesBlock =
      sourceDirectives.length > 0
        ? '\n' + sourceDirectives.join('\n') + '\n'
        : '';

    const newContent = beforeImport + sourcesBlock + afterImport;

    tree.write(stylesPath, newContent);
    return {
      outOfSyncMessage: `Tailwind @source directives updated. Added ${sourceDirectives.length} source directives.`,
    };
  }

  return {};
}

export default updateTailwindGlobsGenerator;
