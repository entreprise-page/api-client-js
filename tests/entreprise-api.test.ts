import assert from 'node:assert/strict';
import { test } from 'node:test';
import { testClient } from './fake-fetch.ts';

test('get hydrate l’entreprise', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('entreprise.json');

  const entreprise = await client.entreprises().get('009743865');

  assert.equal(http.lastRequest().url.href, 'https://api.test/v1/organisation/entreprise/009743865');
  assert.equal(entreprise.siren, '009743865');
  assert.equal(entreprise.denominationSociale, 'ASS COPRO 1 A 5 R VICTOR HUGO');
  assert.equal(entreprise.formeJuridique.code, 9110);
  assert.equal(entreprise.formeJuridique.abreviation, null);
  assert.equal(entreprise.capitalSocial, null);
  assert.equal(entreprise.siegeSocial?.adresse.commune?.libelle, 'RENNES');
  assert.equal(entreprise.siegeSocial?.adresse.coordonnees?.latitude, 48.112573);
  assert.equal(entreprise.registre.rcs, null, 'rcs est omis par l’API quand il est absent');
  assert.deepEqual(entreprise.finances, []);
});

test('search accepte une chaîne', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('recherche_entreprise.json');

  const resultat = await client.entreprises().search('victor hugo');

  assert.deepEqual(http.lastQuery(), { query: 'victor hugo' });
  assert.equal(http.lastRequest().url.search, '?query=victor%20hugo');
  assert.equal(resultat.page, 1);
  assert.equal(resultat.resultats.length, 2);
  assert.equal(resultat.resultats[0]?.siren, '009743865');
  assert.equal(resultat.resultats[0]?.distanceMetres, null);
});

test('search encode tous les critères', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('recherche_entreprise.json');

  await client.entreprises().search({
    query: 'plombier',
    activites: ['43.22A', '43.22B'],
    categoriesJuridiques: [5499, 5710],
    actif: false,
    zone: { latitude: 45.7672724, longitude: 4.8340594, rayon: 15 },
    page: 2,
    parPage: 50,
  });

  assert.deepEqual(http.lastQuery(), {
    query: 'plombier',
    activite: '43.22A,43.22B',
    categorie_juridique: '5499,5710',
    actif: 'false',
    latitude: '45.7672724',
    longitude: '4.8340594',
    rayon: '15',
    page: '2',
    par_page: '50',
  });
});

test('suggest', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suggestions.json');

  const suggestions = await client.entreprises().suggest('gain', 2);

  assert.deepEqual(http.lastQuery(), { query: 'gain', limit: '2' });
  assert.equal(suggestions.length, 2);
  assert.equal(suggestions[1]?.slug, 'gain-emile-s-a-r-l-097380463');
  assert.equal(suggestions[1]?.active, true);
});
