# @entreprise-page/api-client

Client JavaScript et TypeScript de l'[API entreprise.page](https://api.entreprise.page/v1), construit à partir du swagger de l'API (`api/docs/swagger.json`), comme le SDK PHP.

- Node.js 22 ou plus côté serveur (Deno et Bun conviennent aussi), et tous les navigateurs récents.
- Aucune dépendance : les requêtes passent par le `fetch` natif, que l'on peut remplacer pour ajouter du cache, des retries ou des logs.
- Paquet ESM uniquement. `require()` fonctionne aussi depuis Node 22.12.
- Réponses validées puis converties en objets typés, avec des propriétés en camelCase (`denominationSociale`). Un champ manquant ou mal typé lève une `UnexpectedResponseError`.

## Deux points d'entrée

La clé d'API ne doit pas apparaître dans le code envoyé au navigateur : n'importe quel visiteur pourrait la lire et consommer le quota. Le paquet propose donc deux clients.

| Point d'entrée                        | Client                     | Usage                                                  |
| ------------------------------------- | -------------------------- | ------------------------------------------------------ |
| `@entreprise-page/api-client`         | `Client` (clé obligatoire) | serveur : tous les endpoints                           |
| `@entreprise-page/api-client/browser` | `PublicClient` (sans clé)  | navigateur : suggestion d'entreprises et dictionnaires |

`PublicClient` n'envoie ni clé ni en-tête personnalisé. Ses requêtes restent ainsi des requêtes CORS simples, sans requête préalable (preflight). Le point d'entrée `/browser` n'importe pas le code du client complet : un bundle front qui n'utilise que la suggestion pèse environ 2 ko gzippés.

`Client` refuse de se construire dans un navigateur. L'option `dangerouslyAllowBrowser: true` lève ce contrôle pour les environnements qui ressemblent à un navigateur sans en être un (tests jsdom, rendu serveur). Même avec cette option, l'API n'autorise pas l'en-tête `X-API-Key` en CORS.

## Installation

```bash
npm install @entreprise-page/api-client
```

## Côté serveur

```ts
import { Client } from '@entreprise-page/api-client';

const client = new Client({ apiKey: process.env.ENTREPRISE_PAGE_API_KEY! });

const entreprise = await client.entreprises().get('443061841');
console.log(entreprise.denominationSociale);

const { resultats: activites } = await client.activites().search('plombier');

const resultats = await client.entreprises().search({
  query: '*',
  activites: activites.map((activite) => activite.code),
  actif: true,
  zone: { latitude: 45.7672724, longitude: 4.8340594, rayon: 10 },
  parPage: 50,
});
```

| Méthode                                         | Endpoint                                             | Clé d'API | `PublicClient` |
| ----------------------------------------------- | ---------------------------------------------------- | --------- | -------------- |
| `entreprises().get(siren)`                      | `GET /organisation/entreprise/{siren}`               | oui       |                |
| `entreprises().search(query)`                   | `GET /organisation/recherche`                        | oui       |                |
| `entreprises().suggest(query, limit)`           | `GET /organisation/suggestion`                       | non       | oui            |
| `etablissements().get(siret)`                   | `GET /organisation/etablissement/{siret}`            | oui       |                |
| `etablissements().listBySiren(siren, filtres)`  | `GET /organisation/entreprise/{siren}/etablissement` | oui       |                |
| `annonces().listBySiren(siren)`                 | `GET /organisation/entreprise/{siren}/annonce`       | oui       |                |
| `activites().list()` / `get(code)`              | `GET /dictionnaire/activite[/{code}]`                | non       | oui            |
| `activites().search(query)`                     | `GET /dictionnaire/recherche/activite`               | oui       |                |
| `conventionsCollectives().list()` / `get(idcc)` | `GET /dictionnaire/convention-collective[/{code}]`   | non       | oui            |
| `formesJuridiques().list()` / `get(code)`       | `GET /dictionnaire/forme-juridique[/{code}]`         | non       | oui            |
| `compte().quota()`                              | `GET /quota`                                         | oui       |                |

Toutes les méthodes acceptent en dernier argument `{ signal }` pour annuler la requête.

## Côté navigateur

```ts
import { PublicClient } from '@entreprise-page/api-client/browser';

const client = new PublicClient();
let controller: AbortController | undefined;

input.addEventListener('input', async () => {
  // Annule la suggestion précédente : seule la dernière frappe compte.
  controller?.abort();
  controller = new AbortController();

  try {
    const suggestions = await client.entreprises().suggest(input.value, 10, { signal: controller.signal });
    render(suggestions);
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      throw error;
    }
  }
});
```

Pour les endpoints qui demandent une clé, le front appelle votre propre serveur, qui utilise `Client`.

## Erreurs

Toutes les erreurs héritent de `EntreprisePageError`.

| Erreur                                                                                         | Cas                                                                                                                |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `TooManyRequestsError`, `ServerError` | statut HTTP 400, 401/403, 404, 429, 5xx ; toutes héritent de `ApiError`, qui expose `status`, `body` et `response` |
| `TransportError`                                                                               | aucune réponse reçue (réseau, timeout, ou, dans un navigateur, requête bloquée par CORS)                           |
| `UnexpectedResponseError`                                                                      | réponse qui ne respecte pas le contrat (JSON invalide, champ manquant ou mal typé)                                 |
| `InvalidArgumentError`                                                                         | paramètres invalides, détectés avant l'envoi                                                                       |

Une requête annulée par `signal` rejette avec l'`AbortError` de `fetch`, sans conversion.
