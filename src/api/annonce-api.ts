import * as Data from '../data.ts';
import { readAnnonce, type Annonce } from '../models.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

export class AnnonceApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.annonces()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /organisation/entreprise/{siren}/annonce — annonces BODACC, de la plus récente
   * à la plus ancienne, hors dépôts des comptes annuels. Nécessite une clé d'API.
   */
  async listBySiren(siren: string, options?: RequestOptions): Promise<Annonce[]> {
    return Data.mapList(
      await this.#transport.get(`/organisation/entreprise/${segment(siren)}/annonce`, {}, options),
      readAnnonce,
    );
  }
}
