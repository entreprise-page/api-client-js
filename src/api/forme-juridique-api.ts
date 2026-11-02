import * as Data from '../data.ts';
import { readFormeJuridique, type FormeJuridique } from '../models.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

export class FormeJuridiqueApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.formesJuridiques()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /dictionnaire/forme-juridique.
   */
  async list(options?: RequestOptions): Promise<FormeJuridique[]> {
    return Data.mapList(await this.#transport.get('/dictionnaire/forme-juridique', {}, options), readFormeJuridique);
  }

  /**
   * GET /dictionnaire/forme-juridique/{code}.
   *
   * @param code code de forme juridique, par exemple « 5499 »
   */
  async get(code: string, options?: RequestOptions): Promise<FormeJuridique> {
    return Data.root(
      await this.#transport.get(`/dictionnaire/forme-juridique/${segment(code)}`, {}, options),
      readFormeJuridique,
    );
  }
}
