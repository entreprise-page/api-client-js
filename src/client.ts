import { ActiviteApi } from './api/activite-api.ts';
import { AnnonceApi } from './api/annonce-api.ts';
import { CompteApi } from './api/compte-api.ts';
import { ConventionCollectiveApi } from './api/convention-collective-api.ts';
import { EntrepriseApi } from './api/entreprise-api.ts';
import { EtablissementApi } from './api/etablissement-api.ts';
import { FormeJuridiqueApi } from './api/forme-juridique-api.ts';
import { InvalidArgumentError } from './errors.ts';
import { DEFAULT_BASE_URL, isBrowser, Transport, USER_AGENT, type Fetch } from './transport.ts';

export interface ClientOptions {
  /** Clé envoyée dans l'en-tête X-API-Key. */
  apiKey: string;
  /** `https://api.entreprise.page/v1` par défaut. */
  baseUrl?: string | undefined;
  /** Implémentation de fetch, à fournir pour ajouter du cache, des retries ou des logs. */
  fetch?: Fetch | undefined;
  userAgent?: string | undefined;
  /**
   * Autorise le client dans un environnement qui ressemble à un navigateur (tests jsdom, rendu serveur…).
   * Dans un vrai navigateur, la clé d'API serait lisible par n'importe quel visiteur : utiliser `PublicClient`.
   */
  dangerouslyAllowBrowser?: boolean | undefined;
}

/**
 * Point d'entrée du SDK de l'API entreprise.page, à utiliser côté serveur (Node.js, Deno, Bun…).
 *
 * Depuis un navigateur, utiliser `PublicClient` (`@entreprise-page/api-client/browser`),
 * limité aux endpoints qui ne demandent pas de clé d'API.
 */
export class Client {
  readonly #transport: Transport;

  #entreprises?: EntrepriseApi;
  #etablissements?: EtablissementApi;
  #annonces?: AnnonceApi;
  #activites?: ActiviteApi;
  #conventionsCollectives?: ConventionCollectiveApi;
  #formesJuridiques?: FormeJuridiqueApi;
  #compte?: CompteApi;

  constructor(options: ClientOptions) {
    if (typeof options.apiKey !== 'string' || options.apiKey.trim() === '') {
      throw new InvalidArgumentError("apiKey est obligatoire : sans clé d'API, utiliser PublicClient.");
    }

    const browser = isBrowser();
    if (browser && options.dangerouslyAllowBrowser !== true) {
      throw new InvalidArgumentError(
        "Client expose la clé d'API dans le navigateur : utiliser PublicClient (@entreprise-page/api-client/browser) " +
          "ou appeler l'API depuis un serveur.",
      );
    }

    this.#transport = new Transport({
      fetch: options.fetch,
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      apiKey: options.apiKey,
      // Un navigateur ne laisse pas remplacer User-Agent.
      userAgent: browser ? null : (options.userAgent ?? USER_AGENT),
    });
  }

  entreprises(): EntrepriseApi {
    return (this.#entreprises ??= new EntrepriseApi(this.#transport));
  }

  etablissements(): EtablissementApi {
    return (this.#etablissements ??= new EtablissementApi(this.#transport));
  }

  annonces(): AnnonceApi {
    return (this.#annonces ??= new AnnonceApi(this.#transport));
  }

  activites(): ActiviteApi {
    return (this.#activites ??= new ActiviteApi(this.#transport));
  }

  conventionsCollectives(): ConventionCollectiveApi {
    return (this.#conventionsCollectives ??= new ConventionCollectiveApi(this.#transport));
  }

  formesJuridiques(): FormeJuridiqueApi {
    return (this.#formesJuridiques ??= new FormeJuridiqueApi(this.#transport));
  }

  compte(): CompteApi {
    return (this.#compte ??= new CompteApi(this.#transport));
  }
}
