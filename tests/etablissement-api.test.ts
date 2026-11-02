import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixtureText, testClient } from './fake-fetch.ts';

test('get', async () => {
  const { http, client } = testClient();
  const [premier] = JSON.parse(fixtureText('etablissements.json')) as unknown[];
  http.willRespond(200, JSON.stringify(premier));

  const etablissement = await client.etablissements().get('00974386500017');

  assert.equal(http.lastRequest().url.pathname, '/v1/organisation/etablissement/00974386500017');
  assert.equal(etablissement.siret, '00974386500017');
  assert.equal(etablissement.estSiege, true);
});

test('listBySiren avec filtres', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('etablissements.json');

  const etablissements = await client.etablissements().listBySiren('009743865', {
    actifs: true,
    activites: ['81.10Z'],
    codesPostaux: ['35000', '35200'],
    numerosDepartements: ['35'],
  });

  assert.equal(http.lastRequest().url.pathname, '/v1/organisation/entreprise/009743865/etablissement');
  assert.deepEqual(http.lastQuery(), {
    actifs: 'true',
    activites: '81.10Z',
    code_postaux: '35000,35200',
    numeros_departements: '35',
  });
  assert.equal(etablissements.length, 1);
});

test('listBySiren sans filtre', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('etablissements.json');

  await client.etablissements().listBySiren('009743865');

  assert.equal(http.lastRequest().url.search, '');
});
