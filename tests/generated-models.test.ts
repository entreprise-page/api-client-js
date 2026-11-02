import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { generate } from '../bin/generate-models.ts';

const swagger = fileURLToPath(new URL('../../../../api/docs/swagger.json', import.meta.url));
const models = fileURLToPath(new URL('../src/models.ts', import.meta.url));

/**
 * Échoue si src/models.ts n'a pas été régénéré après une modification du swagger :
 * lancer `npm run generate`.
 */
test(
  'les modèles sont à jour du swagger',
  { skip: !existsSync(swagger) && 'Swagger introuvable hors du monorepo.' },
  async () => {
    assert.equal(
      readFileSync(models, 'utf8'),
      await generate(swagger, models),
      "src/models.ts n'est pas à jour : lancer `npm run generate`.",
    );
  },
);
