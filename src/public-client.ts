import { ConventionCollectiveApi } from './api/convention-collective-api.ts';
import { FormeJuridiqueApi } from './api/forme-juridique-api.ts';
import { PublicActiviteApi } from './api/public-activite-api.ts';
import { PublicEntrepriseApi } from './api/public-entreprise-api.ts';
import { DEFAULT_BASE_URL, Transport, type Fetch } from './transport.ts';

export interface PublicClientOptions {
  /** `https://api.entreprise.page/v1` par défaut. */
  baseUrl?: string | undefined;
  /** Implémentation de fetch, à fournir pour ajouter du cache, des retries ou des logs. */
  fetch?: Fetch | undefined;
}

/**
 * Client des endpoints de l'API entreprise.page qui ne demandent pas de clé d'API :
 * suggestion d'entreprises et dictionnaires. Utilisable depuis un navigateur.
 *
 * N'envoie ni clé ni en-tête personnalisé, pour que les requêtes restent des requêtes
 * CORS simples, sans requête préalable (preflight).
 */
export class PublicClient {
  readonly #transport: Transport;

  #entreprises?: PublicEntrepriseApi;
  #activites?: PublicActiviteApi;
  #conventionsCollectives?: ConventionCollectiveApi;
  #formesJuridiques?: FormeJuridiqueApi;

  constructor(options: PublicClientOptions = {}) {
    this.#transport = new Transport({
      fetch: options.fetch,
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      apiKey: null,
      userAgent: null,
    });
  }

  entreprises(): PublicEntrepriseApi {
    return (this.#entreprises ??= new PublicEntrepriseApi(this.#transport));
  }

  activites(): PublicActiviteApi {
    return (this.#activites ??= new PublicActiviteApi(this.#transport));
  }

  conventionsCollectives(): ConventionCollectiveApi {
    return (this.#conventionsCollectives ??= new ConventionCollectiveApi(this.#transport));
  }

  formesJuridiques(): FormeJuridiqueApi {
    return (this.#formesJuridiques ??= new FormeJuridiqueApi(this.#transport));
  }
}
