import assert from 'node:assert/strict';
import { test } from 'node:test';
import { testClient } from './fake-fetch.ts';

test('listBySiren', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('annonces.json');

  const annonces = await client.annonces().listBySiren('443061841');

  assert.equal(http.lastRequest().url.pathname, '/v1/organisation/entreprise/443061841/annonce');
  assert.equal(annonces.length, 1);
  const annonce = annonces[0]!;
  assert.equal(annonce.id, 'A202001221441');
  assert.equal(annonce.parution.numeroAnnonce, 1441);
  assert.equal(annonce.personnes[0]?.capital?.montant, 10000);
  assert.deepEqual(annonce.acte?.vente?.oppositions, ['Au fonds vendu']);
  assert.deepEqual(annonce.precedentsProprietaires, [], 'une liste null est lue comme vide');
  assert.equal(annonce.jugement, null);
  assert.equal(annonce.depot, null, 'un objet nullable absent est lu comme null');
});
