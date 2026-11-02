/**
 * Point d'entrée navigateur : uniquement les endpoints sans clé d'API.
 *
 * N'importe rien qui puisse transporter une clé, pour que le bundle front
 * ne contienne que le nécessaire.
 *
 * @module
 */

export { PublicClient, type PublicClientOptions } from './public-client.ts';
export type { PublicEntrepriseApi } from './api/public-entreprise-api.ts';
export type { PublicActiviteApi } from './api/public-activite-api.ts';
export type { ConventionCollectiveApi } from './api/convention-collective-api.ts';
export type { FormeJuridiqueApi } from './api/forme-juridique-api.ts';
export { DEFAULT_BASE_URL, type Fetch, type RequestOptions } from './transport.ts';
export * from './errors.ts';
export type { Activite, Convention, FormeJuridique, Suggestion } from './models.ts';
