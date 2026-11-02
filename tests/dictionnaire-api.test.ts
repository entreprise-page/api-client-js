import assert from 'node:assert/strict';
import { test } from 'node:test';
import { testClient } from './fake-fetch.ts';

test('activites().search', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('recherche_activite.json');

  const resultat = await client.activites().search({ query: 'plombier', section: 'Construction', page: 1, parPage: 2 });

  assert.equal(http.lastRequest().url.pathname, '/v1/dictionnaire/recherche/activite');
  assert.deepEqual(http.lastQuery(), { query: 'plombier', section: 'Construction', page: '1', par_page: '2' });
  assert.equal(resultat.resultats[0]?.code, '43.22A');
  assert.ok(resultat.resultats[0]?.motsCles.includes('plombier'));
});

test('activites().get encode le code dans le chemin', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"code":"62.02A","libelle":"Conseil en systèmes et logiciels informatiques","section":null}');

  const activite = await client.activites().get('62.02A');

  assert.equal(http.lastRequest().url.pathname, '/v1/dictionnaire/activite/62.02A');
  assert.equal(activite.section, null);
});

test('formesJuridiques().list', async () => {
  const { http, client } = testClient();
  http.willRespond(
    200,
    '[{"libelle":"entreprise unipersonnelle à responsabilité limitée","code":5499,"abreviation":"EURL"}]',
  );

  const formes = await client.formesJuridiques().list();

  assert.equal(http.lastRequest().url.pathname, '/v1/dictionnaire/forme-juridique');
  assert.equal(formes[0]?.abreviation, 'EURL');
});

test('conventionsCollectives().get', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"idcc":1486,"libelle":"SYNTEC"}');

  const convention = await client.conventionsCollectives().get('1486');

  assert.equal(http.lastRequest().url.pathname, '/v1/dictionnaire/convention-collective/1486');
  assert.equal(convention.idcc, 1486);
});

test('compte().quota', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"total":12,"max":1000}');

  const quota = await client.compte().quota();

  assert.equal(http.lastRequest().url.pathname, '/v1/quota');
  assert.deepEqual(quota, { total: 12, max: 1000 });
});
