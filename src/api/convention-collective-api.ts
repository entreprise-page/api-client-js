import * as Data from '../data.ts';
import { readConvention, type Convention } from '../models.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

export class ConventionCollectiveApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.conventionsCollectives()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /dictionnaire/convention-collective.
   */
  async list(options?: RequestOptions): Promise<Convention[]> {
    return Data.mapList(await this.#transport.get('/dictionnaire/convention-collective', {}, options), readConvention);
  }

  /**
   * GET /dictionnaire/convention-collective/{code}.
   *
   * @param idcc code IDCC, par exemple « 1486 »
   */
  async get(idcc: string, options?: RequestOptions): Promise<Convention> {
    return Data.root(
      await this.#transport.get(`/dictionnaire/convention-collective/${segment(idcc)}`, {}, options),
      readConvention,
    );
  }
}
