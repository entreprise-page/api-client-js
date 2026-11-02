import * as Data from '../data.ts';
import { readRechercheActivite, type RechercheActivite } from '../models.ts';
import { rechercheActiviteQuery, type RechercheActiviteParams } from '../query.ts';
import type { RequestOptions } from '../transport.ts';
import { PublicActiviteApi } from './public-activite-api.ts';

export class ActiviteApi extends PublicActiviteApi {
  /**
   * GET /dictionnaire/recherche/activite — retrouve des codes NAF depuis un terme courant.
   * Nécessite une clé d'API et consomme le quota. Les codes obtenus s'utilisent dans
   * le critère `activites` de `entreprises().search()`.
   */
  async search(query: string | RechercheActiviteParams, options?: RequestOptions): Promise<RechercheActivite> {
    const params = rechercheActiviteQuery(typeof query === 'string' ? { query } : query);

    return Data.root(
      await this.transport.get('/dictionnaire/recherche/activite', params, options),
      readRechercheActivite,
    );
  }
}
