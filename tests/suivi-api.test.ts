import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BadRequestError, InvalidArgumentError, NotFoundError, TransportError } from '../src/index.ts';
import { testClient, type FakeFetch } from './fake-fetch.ts';

function assertRequest(http: FakeFetch, method: string, path: string, body?: unknown): void {
  const request = http.lastRequest();
  assert.equal(request.method, method);
  assert.equal(request.url.pathname, `/v1${path}`);
  if (body === undefined) {
    assert.equal(request.body, null);
    assert.equal(request.headers.get('Content-Type'), null);
  } else {
    assert.deepEqual(JSON.parse(request.body ?? 'null'), body);
    assert.equal(request.headers.get('Content-Type'), 'application/json');
  }
  assert.equal(request.headers.get('X-API-Key'), 'cle-de-test');
}

test('lists hydrate les listes et le maximum du plan', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"listes":[{"id":1,"nom":"Clients"},{"id":3,"nom":"Prospects"}],"max_liste":5}');

  const listes = await client.suivi().lists();

  assertRequest(http, 'GET', '/suivi/liste');
  assert.equal(listes.maxListe, 5);
  assert.equal(listes.listes.length, 2);
  assert.equal(listes.listes[1]?.nom, 'Prospects');
});

test('createList envoie le nom', async () => {
  const { http, client } = testClient();
  http.willRespond(201, '{"id":4,"nom":"Fournisseurs été"}');

  const liste = await client.suivi().createList('Fournisseurs été');

  assertRequest(http, 'POST', '/suivi/liste', { nom: 'Fournisseurs été' });
  assert.deepEqual(liste, { id: 4, nom: 'Fournisseurs été' });
});

test('deleteList accepte une réponse 204 sans corps', async () => {
  const { http, client } = testClient();
  http.willRespond(204, '');

  assert.equal(await client.suivi().deleteList(3), undefined);

  assertRequest(http, 'DELETE', '/suivi/liste/3');
});

test('companies interroge la première liste par défaut', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suivi_liste_entreprise.json');

  await client.suivi().companies();

  assertRequest(http, 'GET', '/suivi/entreprise');
  assert.equal(http.lastRequest().url.search, '');
});

test('companies pagine une liste et hydrate les entreprises', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suivi_liste_entreprise.json');

  const liste = await client.suivi().companies({ listeId: 3, page: 1, parPage: 2 });

  assert.deepEqual(http.lastQuery(), { liste: '3', page: '1', par_page: '2' });
  assert.equal(liste.nom, 'Prospects');
  assert.equal(liste.pagination.totalResultat, 3);
  assert.equal(liste.entreprises.length, 2);
  assert.equal(liste.entreprises[0]?.denomination, 'TOTALENERGIES SE');
  assert.equal(liste.entreprises[0]?.dateEnCessation, null);
  assert.equal(liste.entreprises[1]?.denomination, null);
  assert.equal(liste.entreprises[1]?.activiteLibelle, null);
  assert.equal(liste.entreprises[1]?.estActive, false);
});

test('isFollowed renvoie le statut de suivi', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"est_suivie":true}').willRespond(200, '{"est_suivie":false}');

  assert.equal(await client.suivi().isFollowed('552032534'), true);
  assertRequest(http, 'GET', '/suivi/entreprise/552032534');
  assert.equal(await client.suivi().isFollowed('542051180'), false);
});

test('follow envoie le siren et accepte une réponse 204', async () => {
  const { http, client } = testClient();
  http.willRespond(204, '');

  assert.equal(await client.suivi().follow(3, '552032534'), undefined);

  assertRequest(http, 'POST', '/suivi/liste/3/entreprise', { siren: '552032534' });
});

test('import joint une liste de siren par des virgules', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"total":3,"succes":2,"erreur":1}');

  const statut = await client.suivi().import(3, ['542051180', '443061841', '000000000']);

  assertRequest(http, 'POST', '/suivi/liste/3/import', { sirens: '542051180,443061841,000000000' });
  assert.deepEqual(statut, { total: 3, succes: 2, erreur: 1 });
});

test('import transmet une chaîne telle quelle', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"total":2,"succes":2,"erreur":0}');

  await client.suivi().import(3, '542051180\n443061841');

  assertRequest(http, 'POST', '/suivi/liste/3/import', { sirens: '542051180\n443061841' });
});

test('removeFromList retire l’entreprise d’une liste', async () => {
  const { http, client } = testClient();
  http.willRespond(204, '');

  await client.suivi().removeFromList(3, '552032534');

  assertRequest(http, 'DELETE', '/suivi/liste/3/entreprise/552032534');
});

test('unfollow retire l’entreprise de toutes les listes', async () => {
  const { http, client } = testClient();
  http.willRespond(204, '');

  await client.suivi().unfollow('552032534');

  assertRequest(http, 'DELETE', '/suivi/entreprise/552032534');
});

test('alert hydrate l’alerte', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suivi_alerte.json');

  const alerte = await client.suivi().alert(3);

  assertRequest(http, 'GET', '/suivi/liste/3/alerte');
  assert.equal(alerte.listeId, 3);
  assert.equal(alerte.active, true);
  assert.deepEqual(alerte.evenements, ['fermeture_entreprise', 'changement_denomination']);
  assert.deepEqual(alerte.email, { active: true, adresses: ['veille@exemple.fr'] });
  assert.deepEqual(alerte.webhook, { active: false, url: 'https://exemple.fr/webhook', token: '5f1c9a0e' });
  assert.equal(alerte.evenementsDisponibles.length, 3);
});

test('configureAlert envoie toute la configuration en PUT', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suivi_alerte.json');

  const alerte = await client.suivi().configureAlert(3, {
    active: true,
    evenements: ['fermeture_entreprise', 'changement_denomination'],
    email: { active: true, adresses: ['veille@exemple.fr'] },
    webhook: { active: false, url: 'https://exemple.fr/webhook', token: '5f1c9a0e' },
  });

  assertRequest(http, 'PUT', '/suivi/liste/3/alerte', {
    active: true,
    evenements: ['fermeture_entreprise', 'changement_denomination'],
    email: { active: true, adresses: ['veille@exemple.fr'] },
    webhook: { active: false, url: 'https://exemple.fr/webhook', token: '5f1c9a0e' },
  });
  assert.equal(alerte.active, true);
});

test('enableAlert et disableAlert envoient un POST sans corps', async () => {
  const { http, client } = testClient();
  http.willRespondWithFixture('suivi_alerte.json').willRespond(200, fixtureInactive());

  assert.equal((await client.suivi().enableAlert(3)).active, true);
  assertRequest(http, 'POST', '/suivi/liste/3/alerte/activer');

  assert.equal((await client.suivi().disableAlert(3)).active, false);
  assertRequest(http, 'POST', '/suivi/liste/3/alerte/desactiver');
});

test('remonte le message des erreurs du suivi', async () => {
  const { http, client } = testClient();
  http
    .willRespond(404, '{"erreur":"Liste introuvable"}')
    .willRespond(400, '{"erreur":"Nombre maximum de listes atteint"}');

  await assert.rejects(client.suivi().deleteList(99), (error) => {
    assert.ok(error instanceof NotFoundError);
    assert.equal(error.message, 'Liste introuvable');

    return true;
  });
  await assert.rejects(client.suivi().createList('Trop'), (error) => {
    assert.ok(error instanceof BadRequestError);
    assert.equal(error.message, 'Nombre maximum de listes atteint');

    return true;
  });
});

test('nomme la méthode dans les erreurs réseau', async () => {
  const { http, client } = testClient();
  http.willFail(new Error('Connexion refusée'));

  await assert.rejects(client.suivi().unfollow('552032534'), {
    name: TransportError.name,
    message: 'Échec de la requête DELETE /suivi/entreprise/552032534 : Connexion refusée',
  });
});

test('refuse un identifiant de liste invalide avant l’envoi', async () => {
  const { http, client } = testClient();

  await assert.rejects(client.suivi().follow(1.5, '552032534'), InvalidArgumentError);
  await assert.rejects(client.suivi().companies({ listeId: 0 }), InvalidArgumentError);
  assert.equal(http.requests.length, 0);
});

function fixtureInactive(): string {
  return JSON.stringify({
    liste_id: 3,
    active: false,
    evenements: ['fermeture_entreprise'],
    email: { active: true, adresses: ['veille@exemple.fr'] },
    webhook: { active: false, url: '', token: '' },
    evenements_disponibles: ['fermeture_entreprise'],
  });
}
