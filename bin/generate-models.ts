/*
 * Génère les modèles du SDK (src/models.ts) à partir des définitions du swagger de l'API.
 *
 * Usage : node bin/generate-models.ts <swagger.json> <fichier de sortie>
 *
 * Seuls les modèles sont générés : les endpoints sont écrits à la main dans src/api,
 * car le swagger produit par swag ne décrit pas toujours fidèlement les réponses.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

type Schema = Record<string, unknown>;

/** Corrige les noms de définitions peu parlants ou mal orthographiés côté API. */
const RENAMES: Record<string, string> = {
  Coordoonnees: 'Coordonnees',
  Search: 'RechercheEntreprise',
};

const SCALARS: Record<string, [ts: string, reader: string]> = {
  string: ['string', 'string'],
  integer: ['number', 'int'],
  number: ['number', 'float'],
  boolean: ['boolean', 'bool'],
};

function schema(value: unknown, context: string): Schema {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Schéma invalide pour ${context}`);
  }

  return value as Schema;
}

function className(definition: string): string {
  return RENAMES[definition] ?? definition;
}

function refClass(ref: unknown): string | null {
  return typeof ref === 'string' ? className(ref.slice('#/definitions/'.length)) : null;
}

function camelCase(snake: string): string {
  return snake.replace(/_([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
}

function resolveType(property: Schema, key: string, nullable: boolean): { ts: string; read: string } {
  const allOf = Array.isArray(property.allOf) ? property.allOf : [];
  const ref = refClass(property.$ref ?? (allOf[0] !== undefined ? schema(allOf[0], key).$ref : undefined));
  if (ref !== null) {
    return {
      ts: nullable ? `${ref} | null` : ref,
      read: `Data.${nullable ? 'nullableObject' : 'object'}(data, '${key}', read${ref})`,
    };
  }

  if (property.type === 'array') {
    const items = schema(property.items ?? {}, key);
    const itemRef = refClass(items.$ref);
    if (itemRef !== null) {
      return { ts: `readonly ${itemRef}[]`, read: `Data.objectList(data, '${key}', read${itemRef})` };
    }
    if (items.type === 'string') {
      return { ts: 'readonly string[]', read: `Data.stringList(data, '${key}')` };
    }

    throw new Error(`Type de liste non géré pour ${key}`);
  }

  const scalar = typeof property.type === 'string' ? SCALARS[property.type] : undefined;
  if (scalar === undefined) {
    throw new Error(`Type "${String(property.type)}" non géré pour ${key}`);
  }
  const [ts, reader] = scalar;

  return {
    ts: nullable ? `${ts} | null` : ts,
    read: `Data.${nullable ? `nullable${reader[0]!.toUpperCase()}${reader.slice(1)}` : reader}(data, '${key}')`,
  };
}

function docComment(lines: string[], indent: string): string {
  if (lines.length === 0) {
    return '';
  }

  return `${indent}/**\n${lines.map((line) => `${indent} * ${line}\n`).join('')}${indent} */\n`;
}

function renderModel(name: string, definition: Schema): string {
  const properties = Object.entries(schema(definition.properties ?? {}, 'properties')).map(
    ([key, property]) => [key, schema(property, key)] as const,
  );

  // swag trie les propriétés par ordre alphabétique ; x-order permet d'en remonter certaines.
  const order = (property: Schema): number | null =>
    typeof property['x-order'] === 'string' || typeof property['x-order'] === 'number'
      ? Number(property['x-order'])
      : null;
  properties.sort(([a, pa], [b, pb]) => {
    const [oa, ob] = [order(pa), order(pb)];
    if (oa !== null && ob !== null) {
      return oa - ob;
    }
    if (oa !== null || ob !== null) {
      return oa !== null ? -1 : 1;
    }

    return a < b ? -1 : a > b ? 1 : 0;
  });

  const fields: string[] = [];
  const reads: string[] = [];
  for (const [key, property] of properties) {
    const type = resolveType(property, key, property['x-nullable'] === true);
    const field = camelCase(key);

    const doc: string[] = [];
    if (typeof property.description === 'string') {
      doc.push(property.description.trim().replace(/\s+/g, ' '));
    }
    if ('example' in property) {
      doc.push(`Exemple : ${JSON.stringify(property.example)}`);
    }

    fields.push(`${docComment(doc, '  ')}  readonly ${field}: ${type.ts};`);
    reads.push(`    ${field}: ${type.read},`);
  }

  const description = typeof definition.description === 'string' ? [definition.description.trim()] : [];

  return `${docComment(description, '')}export interface ${name} {
${fields.join('\n')}
}

/** @internal */
export function read${name}(data: Data.Json): ${name} {
  return {
${reads.join('\n')}
  };
}
`;
}

export async function generate(swaggerPath: string, outputPath: string): Promise<string> {
  const swagger = schema(JSON.parse(readFileSync(swaggerPath, 'utf8')), swaggerPath);
  const definitions = schema(swagger.definitions, 'definitions');

  const models = Object.entries(definitions)
    .map(([name, definition]) => [className(name), schema(definition, name)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, definition]) => renderModel(name, definition));

  const source = `// Généré par bin/generate-models.ts depuis api/docs/swagger.json, ne pas modifier à la main.

import * as Data from './data.ts';

${models.join('\n')}`;

  return format(source, { ...(await resolveConfig(outputPath)), filepath: outputPath });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [swaggerPath, outputPath] = process.argv.slice(2);
  if (swaggerPath === undefined || outputPath === undefined) {
    process.stderr.write('Usage : node bin/generate-models.ts <swagger.json> <fichier de sortie>\n');
    process.exit(1);
  }

  writeFileSync(outputPath, await generate(swaggerPath, outputPath));
}
