import * as Data from '../data.ts';
import { readSuggestion, type Suggestion } from '../models.ts';
import type { RequestOptions, Transport } from '../transport.ts';

/** Endpoints entreprise accessibles sans clé d'API, utilisables depuis un navigateur. */
export class PublicEntrepriseApi {
  protected readonly transport: Transport;

  /** @internal utiliser `client.entreprises()` */
  constructor(transport: Transport) {
    this.transport = transport;
  }

  /**
   * GET /organisation/suggestion — autocomplétion, sans clé d'API.
   *
   * @param limit 1 à 10, 1 par défaut côté API
   */
  async suggest(query: string, limit?: number, options?: RequestOptions): Promise<Suggestion[]> {
    const params: Record<string, string> = { query };
    if (limit !== undefined) {
      params.limit = limit.toString();
    }

    return Data.mapList(await this.transport.get('/organisation/suggestion', params, options), readSuggestion);
  }
}
