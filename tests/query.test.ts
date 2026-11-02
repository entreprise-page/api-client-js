import assert from 'node:assert/strict';
import { test } from 'node:test';
import { InvalidArgumentError } from '../src/index.ts';
import { testClient } from './fake-fetch.ts';

const criteresInvalides = {
  'rayon trop petit': [
    (c) => c.entreprises().search({ query: 'a', zone: { latitude: 45, longitude: 4, rayon: 0 } }),
    'entre 1 et 500',
  ],
  'rayon trop grand': [
    (c) => c.entreprises().search({ query: 'a', zone: { latitude: 45, longitude: 4, rayon: 501 } }),
    'entre 1 et 500',
  ],
  'par page entreprise': [(c) => c.entreprises().search({ query: 'a', parPage: 251 }), 'entre 1 et 250'],
  'page nulle': [(c) => c.entreprises().search({ query: 'a', page: 0 }), 'supérieure ou égale à 1'],
  'page non entière': [(c) => c.entreprises().search({ query: 'a', page: 1.5 }), 'supérieure ou égale à 1'],
  'activité vide': [(c) => c.activites().search('  '), 'query est obligatoire'],
  'par page activité': [(c) => c.activites().search({ query: 'plombier', parPage: 101 }), 'entre 1 et 100'],
} satisfies Record<string, [(client: ReturnType<typeof testClient>['client']) => Promise<unknown>, string]>;

for (const [cas, [appel, message]] of Object.entries(criteresInvalides)) {
  test(`refuse les critères invalides : ${cas}`, async () => {
    const { http, client } = testClient();

    await assert.rejects(
      appel(client),
      (error) => error instanceof InvalidArgumentError && error.message.includes(message),
    );
    assert.equal(http.requests.length, 0, 'rien n’est envoyé');
  });
}

test('omet les critères non renseignés', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('recherche_entreprise.json');

  await client.entreprises().search({ query: 'google', activites: [], actif: undefined });

  assert.deepEqual(http.lastQuery(), { query: 'google' });
});
