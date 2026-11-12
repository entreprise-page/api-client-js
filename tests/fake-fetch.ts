import { readFileSync } from 'node:fs';
import { Client } from '../src/index.ts';

export interface SentRequest {
  method: string;
  url: URL;
  headers: Headers;
  signal: AbortSignal | null;
  /** Corps envoyé, null sans corps. */
  body: string | null;
}

/**
 * fetch qui renvoie des réponses préparées et garde les requêtes envoyées.
 */
export class FakeFetch {
  readonly requests: SentRequest[] = [];
  readonly #queue: (Response | Error)[] = [];

  readonly fetch = async (input: string, init: RequestInit): Promise<Response> => {
    this.requests.push({
      method: init.method ?? 'GET',
      url: new URL(input),
      headers: new Headers(init.headers),
      signal: init.signal ?? null,
      body: typeof init.body === 'string' ? init.body : null,
    });
    const next = this.#queue.shift();
    if (next === undefined) {
      throw new Error(`Aucune réponse préparée pour ${input}`);
    }
    if (next instanceof Error) {
      throw next;
    }

    return next;
  };

  willRespond(status: number, body: string): this {
    // Une réponse 204 ne peut pas avoir de corps, même vide.
    this.#queue.push(
      new Response(status === 204 ? null : body, { status, headers: { 'Content-Type': 'application/json' } }),
    );

    return this;
  }

  willRespondWithFixture(fixture: string): this {
    return this.willRespond(200, fixtureText(fixture));
  }

  willFail(error: Error): this {
    this.#queue.push(error);

    return this;
  }

  lastRequest(): SentRequest {
    const request = this.requests.at(-1);
    if (request === undefined) {
      throw new Error('Aucune requête envoyée.');
    }

    return request;
  }

  lastQuery(): Record<string, string> {
    return Object.fromEntries(this.lastRequest().url.searchParams);
  }
}

export function fixtureText(fixture: string): string {
  return readFileSync(new URL(`fixtures/${fixture}`, import.meta.url), 'utf8');
}

export function testClient(): { http: FakeFetch; client: Client } {
  const http = new FakeFetch();

  return { http, client: new Client({ apiKey: 'cle-de-test', fetch: http.fetch, baseUrl: 'https://api.test/v1' }) };
}
