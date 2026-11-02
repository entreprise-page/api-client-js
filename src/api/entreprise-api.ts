import * as Data from '../data.ts';
import { readEntreprise, readRechercheEntreprise, type Entreprise, type RechercheEntreprise } from '../models.ts';
import { rechercheEntrepriseQuery, type RechercheEntrepriseParams } from '../query.ts';
import { segment, type RequestOptions } from '../transport.ts';
import { PublicEntrepriseApi } from './public-entreprise-api.ts';

export class EntrepriseApi extends PublicEntrepriseApi {
  /**
   * GET /organisation/entreprise/{siren} — nécessite une clé d'API.
   */
  async get(siren: string, options?: RequestOptions): Promise<Entreprise> {
    return Data.root(
      await this.transport.get(`/organisation/entreprise/${segment(siren)}`, {}, options),
      readEntreprise,
    );
  }

  /**
   * GET /organisation/recherche — nécessite une clé d'API et consomme le quota.
   */
  async search(query: string | RechercheEntrepriseParams, options?: RequestOptions): Promise<RechercheEntreprise> {
    const params = rechercheEntrepriseQuery(typeof query === 'string' ? { query } : query);

    return Data.root(await this.transport.get('/organisation/recherche', params, options), readRechercheEntreprise);
  }
}
