import { ApiError, InvalidArgumentError, TransportError } from './errors.ts';
import { decode, type Json } from './data.ts';

export const DEFAULT_BASE_URL = 'https://api.entreprise.page/v1';
export const USER_AGENT = 'entreprise-page-api-client-js';

/** Options acceptées par chaque appel d'endpoint. */
export interface RequestOptions {
  /** Annule la requête, par exemple quand l'utilisateur continue de taper dans un champ d'autocomplétion. */
  signal?: AbortSignal | undefined;
}

export type Fetch = (input: string, init: RequestInit) => Promise<Response>;

/**
 * Envoie les requêtes à l'API et décode les réponses.
 *
 * @internal
 */
export class Transport {
  readonly #fetch: Fetch;
  readonly #baseUrl: string;
  readonly #headers: Record<string, string>;

  constructor(options: { fetch: Fetch | undefined; baseUrl: string; apiKey: string | null; userAgent: string | null }) {
    const fetch = options.fetch ?? globalThis.fetch?.bind(globalThis);
    if (fetch === undefined) {
      throw new InvalidArgumentError("fetch n'est pas disponible dans cet environnement : passer l'option fetch.");
    }

    this.#fetch = fetch;
    this.#baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.#headers = { Accept: 'application/json' };
    if (options.apiKey !== null) {
      this.#headers['X-API-Key'] = options.apiKey;
    }
    if (options.userAgent !== null) {
      this.#headers['User-Agent'] = options.userAgent;
    }
  }

  async get(path: string, query: Record<string, string> = {}, options: RequestOptions = {}): Promise<Json | unknown[]> {
    const search = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const url = this.#baseUrl + path + (search !== '' ? `?${search}` : '');

    const fetch = this.#fetch;
    let response: Response;
    let body: string;
    try {
      response = await fetch(url, { method: 'GET', headers: this.#headers, signal: options.signal ?? null });
      body = await response.text();
    } catch (error) {
      // Une annulation demandée par l'appelant remonte telle quelle (AbortError), comme avec fetch.
      if (options.signal?.aborted) {
        throw error;
      }

      throw new TransportError(`Échec de la requête GET ${path} : ${(error as Error).message}`, { cause: error });
    }

    if (response.status >= 400) {
      throw ApiError.fromResponse(response, body);
    }

    return decode(body);
  }
}

/**
 * Encode un segment de chemin (siren, siret, code…).
 *
 * @internal
 */
export function segment(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Vrai dans un navigateur ou un web worker, où une clé d'API serait exposée à l'utilisateur.
 *
 * @internal
 */
export function isBrowser(): boolean {
  return (
    (typeof window !== 'undefined' && typeof window.document !== 'undefined') ||
    typeof (globalThis as { WorkerGlobalScope?: unknown }).WorkerGlobalScope !== 'undefined'
  );
}
