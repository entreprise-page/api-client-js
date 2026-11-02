/**
 * Point d'entrée serveur : tous les endpoints, avec clé d'API.
 *
 * @module
 */

export { Client, type ClientOptions } from './client.ts';
export { PublicClient, type PublicClientOptions } from './public-client.ts';
export type { ActiviteApi } from './api/activite-api.ts';
export type { AnnonceApi } from './api/annonce-api.ts';
export type { CompteApi } from './api/compte-api.ts';
export type { ConventionCollectiveApi } from './api/convention-collective-api.ts';
export type { EntrepriseApi } from './api/entreprise-api.ts';
export type { EtablissementApi } from './api/etablissement-api.ts';
export type { FormeJuridiqueApi } from './api/forme-juridique-api.ts';
export type { PublicActiviteApi } from './api/public-activite-api.ts';
export type { PublicEntrepriseApi } from './api/public-entreprise-api.ts';
export type { EtablissementsParams, RechercheActiviteParams, RechercheEntrepriseParams } from './query.ts';
export { DEFAULT_BASE_URL, USER_AGENT, type Fetch, type RequestOptions } from './transport.ts';
export * from './errors.ts';
export type * from './models.ts';
