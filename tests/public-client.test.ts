import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import * as browser from '../src/browser.ts';
import { FakeFetch } from './fake-fetch.ts';

test('n’envoie ni clé ni en-tête personnalisé, pour rester une requête CORS simple', async () => {
  const http = new FakeFetch().willRespondWithFixture('suggestions.json');

  const suggestions = await new browser.PublicClient({ fetch: http.fetch }).entreprises().suggest('gain', 2);

  const { url, headers } = http.lastRequest();
  assert.equal(url.href, 'https://api.entreprise.page/v1/organisation/suggestion?query=gain&limit=2');
  assert.deepEqual([...headers.keys()], ['accept']);
  assert.equal(suggestions.length, 2);
});

test('n’expose que les endpoints sans clé d’API', () => {
  const client = new browser.PublicClient({ fetch: new FakeFetch().fetch });

  assert.equal('get' in client.entreprises(), false);
  assert.equal('search' in client.entreprises(), false);
  assert.equal('search' in client.activites(), false);
  assert.equal('etablissements' in client, false);
  assert.equal('Client' in browser, false);
});

test('les dictionnaires sont accessibles', async () => {
  const http = new FakeFetch().willRespond(200, '[{"idcc":1486,"libelle":"SYNTEC"}]');

  const conventions = await new browser.PublicClient({ fetch: http.fetch }).conventionsCollectives().list();

  assert.equal(conventions[0]?.libelle, 'SYNTEC');
});

/**
 * Le point d'entrée navigateur ne doit pas embarquer le code qui transporte une clé d'API.
 */
test('le point d’entrée navigateur n’importe pas le client complet', () => {
  const visited = new Set<string>();
  const visit = (url: URL): void => {
    if (visited.has(url.href)) {
      return;
    }
    visited.add(url.href);
    for (const [, specifier] of readFileSync(url, 'utf8').matchAll(/^(?:import|export)\s[^;]*?from '(\.[^']+)'/gms)) {
      visit(new URL(specifier!, url));
    }
  };
  visit(new URL('../src/browser.ts', import.meta.url));

  const modules = [...visited].map((href) => href.slice(href.indexOf('/src/') + 1)).sort();
  assert.deepEqual(modules, [
    'src/api/convention-collective-api.ts',
    'src/api/forme-juridique-api.ts',
    'src/api/public-activite-api.ts',
    'src/api/public-entreprise-api.ts',
    'src/browser.ts',
    'src/data.ts',
    'src/errors.ts',
    'src/models.ts',
    'src/public-client.ts',
    'src/transport.ts',
  ]);
});
