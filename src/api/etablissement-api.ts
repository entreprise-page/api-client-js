import * as Data from '../data.ts';
import { readEtablissement, type Etablissement } from '../models.ts';
import { etablissementsQuery, type EtablissementsParams } from '../query.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

export class EtablissementApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.etablissements()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /organisation/etablissement/{siret} — nécessite une clé d'API.
   */
  async get(siret: string, options?: RequestOptions): Promise<Etablissement> {
    return Data.root(
      await this.#transport.get(`/organisation/etablissement/${segment(siret)}`, {}, options),
      readEtablissement,
    );
  }

  /**
   * GET /organisation/entreprise/{siren}/etablissement — nécessite une clé d'API.
   */
  async listBySiren(
    siren: string,
    filtres: EtablissementsParams = {},
    options?: RequestOptions,
  ): Promise<Etablissement[]> {
    return Data.mapList(
      await this.#transport.get(
        `/organisation/entreprise/${segment(siren)}/etablissement`,
        etablissementsQuery(filtres),
        options,
      ),
      readEtablissement,
    );
  }
}
