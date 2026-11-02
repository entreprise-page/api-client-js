import * as Data from '../data.ts';
import { readActivite, type Activite } from '../models.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

/** Endpoints activité accessibles sans clé d'API, utilisables depuis un navigateur. */
export class PublicActiviteApi {
  protected readonly transport: Transport;

  /** @internal utiliser `client.activites()` */
  constructor(transport: Transport) {
    this.transport = transport;
  }

  /**
   * GET /dictionnaire/activite.
   */
  async list(options?: RequestOptions): Promise<Activite[]> {
    return Data.mapList(await this.transport.get('/dictionnaire/activite', {}, options), readActivite);
  }

  /**
   * GET /dictionnaire/activite/{code}.
   *
   * @param code code APE, par exemple « 62.02A »
   */
  async get(code: string, options?: RequestOptions): Promise<Activite> {
    return Data.root(await this.transport.get(`/dictionnaire/activite/${segment(code)}`, {}, options), readActivite);
  }
}
