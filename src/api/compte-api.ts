import * as Data from '../data.ts';
import { readQuota, type Quota } from '../models.ts';
import type { RequestOptions, Transport } from '../transport.ts';

export class CompteApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.compte()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /quota — nécessite une clé d'API.
   */
  async quota(options?: RequestOptions): Promise<Quota> {
    return Data.root(await this.#transport.get('/quota', {}, options), readQuota);
  }
}
