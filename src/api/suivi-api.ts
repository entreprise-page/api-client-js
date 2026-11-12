import * as Data from '../data.ts';
import { InvalidArgumentError } from '../errors.ts';
import {
  readSuiviAlerte,
  readSuiviImportStatut,
  readSuiviListe,
  readSuiviListeEntreprise,
  readSuiviListes,
  readSuiviStatutEntreprise,
  type SuiviAlerte,
  type SuiviConfigurationAlerte,
  type SuiviImportStatut,
  type SuiviListe,
  type SuiviListeEntreprise,
  type SuiviListes,
} from '../models.ts';
import { segment, type RequestOptions, type Transport } from '../transport.ts';

/** Critères de GET /suivi/entreprise. */
export interface SuiviEntreprisesParams {
  /** La première liste de l'organisation par défaut. */
  listeId?: number | undefined;
  page?: number | undefined;
  parPage?: number | undefined;
}

/**
 * Suivi d'entreprises de l'organisation rattachée à la clé d'API.
 *
 * Tous les endpoints nécessitent une clé d'API et ne consomment pas le quota.
 */
export class SuiviApi {
  readonly #transport: Transport;

  /** @internal utiliser `client.suivi()` */
  constructor(transport: Transport) {
    this.#transport = transport;
  }

  /**
   * GET /suivi/liste — les listes de l'organisation et le nombre maximum permis par son plan.
   */
  async lists(options?: RequestOptions): Promise<SuiviListes> {
    return Data.root(await this.#transport.get('/suivi/liste', {}, options), readSuiviListes);
  }

  /**
   * POST /suivi/liste — dans la limite du nombre de listes permis par le plan.
   *
   * @param name 50 caractères maximum
   */
  async createList(name: string, options?: RequestOptions): Promise<SuiviListe> {
    return Data.root(await this.#transport.post('/suivi/liste', { nom: name }, options), readSuiviListe);
  }

  /**
   * DELETE /suivi/liste/{listeId} — supprime aussi les entreprises qu'elle contient.
   */
  async deleteList(listId: number, options?: RequestOptions): Promise<void> {
    await this.#transport.delete(listPath(listId), options);
  }

  /**
   * GET /suivi/entreprise — entreprises d'une liste, triées par siren et paginées.
   *
   * Une pagination hors limites est ramenée dans les bornes par l'API.
   */
  async companies(params: SuiviEntreprisesParams = {}, options?: RequestOptions): Promise<SuiviListeEntreprise> {
    const query: Record<string, string> = {};
    if (params.listeId !== undefined) {
      query['liste'] = String(checkListId(params.listeId));
    }
    if (params.page !== undefined) {
      query['page'] = String(params.page);
    }
    if (params.parPage !== undefined) {
      query['par_page'] = String(params.parPage);
    }

    return Data.root(await this.#transport.get('/suivi/entreprise', query, options), readSuiviListeEntreprise);
  }

  /**
   * GET /suivi/entreprise/{siren} — l'entreprise est-elle suivie dans au moins une liste ?
   */
  async isFollowed(siren: string, options?: RequestOptions): Promise<boolean> {
    const statut = Data.root(
      await this.#transport.get(`/suivi/entreprise/${segment(siren)}`, {}, options),
      readSuiviStatutEntreprise,
    );

    return statut.estSuivie;
  }

  /**
   * POST /suivi/liste/{listeId}/entreprise — dans la limite du nombre de suivis permis par le plan.
   */
  async follow(listId: number, siren: string, options?: RequestOptions): Promise<void> {
    await this.#transport.postWithoutContent(`${listPath(listId)}/entreprise`, { siren }, options);
  }

  /**
   * POST /suivi/liste/{listeId}/import — ajoute plusieurs entreprises à une liste.
   *
   * Un siren invalide, introuvable ou au-delà du nombre maximum de suivis compte comme
   * une erreur sans interrompre l'import ; un siren déjà suivi compte comme un succès.
   *
   * @param sirens liste de siren, ou chaîne séparée par des virgules, des points-virgules,
   *   des espaces ou des retours à la ligne (un seul type de séparateur)
   */
  async import(
    listId: number,
    sirens: string | readonly string[],
    options?: RequestOptions,
  ): Promise<SuiviImportStatut> {
    const body = { sirens: typeof sirens === 'string' ? sirens : sirens.join(',') };

    return Data.root(await this.#transport.post(`${listPath(listId)}/import`, body, options), readSuiviImportStatut);
  }

  /**
   * DELETE /suivi/liste/{listeId}/entreprise/{siren} — l'entreprise reste suivie dans les autres listes.
   */
  async removeFromList(listId: number, siren: string, options?: RequestOptions): Promise<void> {
    await this.#transport.delete(`${listPath(listId)}/entreprise/${segment(siren)}`, options);
  }

  /**
   * DELETE /suivi/entreprise/{siren} — retire l'entreprise de toutes les listes de l'organisation.
   */
  async unfollow(siren: string, options?: RequestOptions): Promise<void> {
    await this.#transport.delete(`/suivi/entreprise/${segment(siren)}`, options);
  }

  /**
   * GET /suivi/liste/{listeId}/alerte — une liste sans alerte renvoie une alerte inactive.
   */
  async alert(listId: number, options?: RequestOptions): Promise<SuiviAlerte> {
    return Data.root(await this.#transport.get(`${listPath(listId)}/alerte`, {}, options), readSuiviAlerte);
  }

  /**
   * PUT /suivi/liste/{listeId}/alerte — remplace toute l'alerte de la liste.
   *
   * Une alerte active demande au moins un événement (voir `SuiviAlerte.evenementsDisponibles`)
   * et un canal actif. Un canal désactivé garde sa configuration.
   */
  async configureAlert(
    listId: number,
    alert: SuiviConfigurationAlerte,
    options?: RequestOptions,
  ): Promise<SuiviAlerte> {
    const body = {
      active: alert.active,
      evenements: [...alert.evenements],
      email: { active: alert.email.active, adresses: [...alert.email.adresses] },
      webhook: { active: alert.webhook.active, url: alert.webhook.url, token: alert.webhook.token },
    };

    return Data.root(await this.#transport.put(`${listPath(listId)}/alerte`, body, options), readSuiviAlerte);
  }

  /**
   * POST /suivi/liste/{listeId}/alerte/activer — l'alerte doit avoir un événement et un canal actif.
   */
  async enableAlert(listId: number, options?: RequestOptions): Promise<SuiviAlerte> {
    return Data.root(
      await this.#transport.post(`${listPath(listId)}/alerte/activer`, undefined, options),
      readSuiviAlerte,
    );
  }

  /**
   * POST /suivi/liste/{listeId}/alerte/desactiver — la configuration est gardée.
   */
  async disableAlert(listId: number, options?: RequestOptions): Promise<SuiviAlerte> {
    return Data.root(
      await this.#transport.post(`${listPath(listId)}/alerte/desactiver`, undefined, options),
      readSuiviAlerte,
    );
  }
}

function listPath(listId: number): string {
  return `/suivi/liste/${segment(checkListId(listId))}`;
}

function checkListId(listId: number): number {
  if (!Number.isInteger(listId) || listId < 1) {
    throw new InvalidArgumentError("l'identifiant de liste doit être un entier supérieur ou égal à 1.");
  }

  return listId;
}
