import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  ApiError,
  BadRequestError,
  Client,
  EntreprisePageError,
  InvalidArgumentError,
  NotFoundError,
  ServerError,
  TooManyRequestsError,
  TransportError,
  UnauthorizedError,
  UnexpectedResponseError,
  USER_AGENT,
} from '../src/index.ts';
import { FakeFetch, testClient } from './fake-fetch.ts';

test('envoie les en-têtes', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"total":0,"max":10}');

  await client.compte().quota();

  const { headers } = http.lastRequest();
  assert.equal(headers.get('X-API-Key'), 'cle-de-test');
  assert.equal(headers.get('Accept'), 'application/json');
  assert.equal(headers.get('User-Agent'), USER_AGENT);
});

test('utilise l’URL de l’API par défaut', async () => {
  const http = new FakeFetch().willRespond(200, '[]');

  await new Client({ apiKey: 'cle', fetch: http.fetch }).entreprises().suggest('google');

  assert.equal(http.lastRequest().url.href, 'https://api.entreprise.page/v1/organisation/suggestion?query=google');
});

test('exige une clé d’API', () => {
  assert.throws(() => new Client({ apiKey: ' ' }), InvalidArgumentError);
});

test('encode les segments de chemin', async () => {
  const { http, client } = testClient();
  http.willRespond(404, '"entreprise introuvable"');

  await assert.rejects(client.entreprises().get('../quota?x=1'), NotFoundError);

  assert.equal(http.lastRequest().url.pathname, '/v1/organisation/entreprise/..%2Fquota%3Fx%3D1');
});

const erreurs = {
  'chaîne JSON': [404, '"entreprise 000000000 introuvable"', NotFoundError, 'entreprise 000000000 introuvable'],
  'objet error': [401, '{"error":"Clé d\'API inconnue"}', UnauthorizedError, "Clé d'API inconnue"],
  quota: [429, '{"error":"Quota dépassé"}', TooManyRequestsError, 'Quota dépassé'],
  'requête invalide': [
    400,
    '"le paramètre query est obligatoire"',
    BadRequestError,
    'le paramètre query est obligatoire',
  ],
  'corps non JSON': [502, 'Bad Gateway', ServerError, 'Bad Gateway'],
  'corps vide': [500, '', ServerError, "L'API a répondu 500"],
  'statut non mappé': [418, '{}', ApiError, "L'API a répondu 418"],
} satisfies Record<string, [number, string, typeof ApiError, string]>;

for (const [cas, [status, body, type, message]] of Object.entries(erreurs)) {
  test(`convertit les erreurs HTTP : ${cas}`, async () => {
    const { http, client } = testClient();
    http.willRespond(status, body);

    const error = await client
      .entreprises()
      .get('000000000')
      .then(() => assert.fail('Une erreur était attendue.'))
      .catch((error: unknown) => error);

    assert.ok(error instanceof type);
    assert.ok(error instanceof EntreprisePageError);
    assert.equal(error.constructor, type);
    assert.equal(error.message, message);
    assert.equal(error.status, status);
    assert.equal(error.body, body);
  });
}

test('convertit les erreurs réseau', async () => {
  const { http, client } = testClient();
  http.willFail(new TypeError('Connexion refusée'));

  await assert.rejects(client.compte().quota(), {
    name: 'TransportError',
    message: 'Échec de la requête GET /quota : Connexion refusée',
  });
  http.willFail(new TypeError('fetch failed'));
  await assert.rejects(client.compte().quota(), TransportError);
});

test('laisse remonter une annulation demandée par l’appelant', async () => {
  const { http, client } = testClient();
  const controller = new AbortController();
  controller.abort();
  http.willFail(new DOMException('This operation was aborted', 'AbortError'));

  await assert.rejects(client.entreprises().suggest('goo', 5, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(http.lastRequest().signal, controller.signal);
});

test('signale un JSON invalide', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '<html>');

  await assert.rejects(client.compte().quota(), UnexpectedResponseError);
});

test('signale un champ mal typé', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '{"total":"12","max":1000}');

  await assert.rejects(client.compte().quota(), {
    name: 'UnexpectedResponseError',
    message: 'Le champ "total" devrait être de type int, string reçu.',
  });
});

test('signale une liste à la place d’un objet', async () => {
  const { http, client } = testClient();
  http.willRespond(200, '[]');

  await assert.rejects(client.compte().quota(), UnexpectedResponseError);
});

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

test('refuse de s’exécuter dans un navigateur avec une clé', () => {
  (globalThis as { window?: unknown }).window = { document: {} };

  assert.throws(() => new Client({ apiKey: 'cle' }), { name: 'InvalidArgumentError', message: /PublicClient/ });
});

test('dangerouslyAllowBrowser autorise le navigateur, sans User-Agent', async () => {
  (globalThis as { window?: unknown }).window = { document: {} };
  const http = new FakeFetch().willRespond(200, '{"total":0,"max":10}');

  await new Client({ apiKey: 'cle', fetch: http.fetch, dangerouslyAllowBrowser: true }).compte().quota();

  assert.equal(http.lastRequest().headers.get('X-API-Key'), 'cle');
  assert.equal(http.lastRequest().headers.has('User-Agent'), false);
});
