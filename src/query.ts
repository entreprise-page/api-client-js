import { InvalidArgumentError } from './errors.ts';

/** Critères de GET /organisation/recherche. */
export interface RechercheEntrepriseParams {
  query: string;
  /** Codes NAF, par exemple ceux renvoyés par `activites().search()`. */
  activites?: readonly string[] | undefined;
  /** Codes de catégorie juridique. */
  categoriesJuridiques?: readonly number[] | undefined;
  /** true pour les entreprises en activité, false pour les cessées. */
  actif?: boolean | undefined;
  zone?:
    | {
        latitude: number;
        longitude: number;
        /** En kilomètres, de 1 à 500 (20 par défaut côté API). */
        rayon?: number | undefined;
      }
    | undefined;
  page?: number | undefined;
  /** De 1 à 250. */
  parPage?: number | undefined;
}

/** Critères de GET /dictionnaire/recherche/activite. */
export interface RechercheActiviteParams {
  /** Terme en langage courant, par exemple « plombier ». */
  query: string;
  /** Section de la nomenclature, par exemple « Construction ». */
  section?: string | undefined;
  page?: number | undefined;
  /** De 1 à 100. */
  parPage?: number | undefined;
}

/** Filtres de GET /organisation/entreprise/{siren}/etablissement. */
export interface EtablissementsParams {
  /** true pour les établissements actifs, false pour les fermés. */
  actifs?: boolean | undefined;
  /** Codes APE. */
  activites?: readonly string[] | undefined;
  codesPostaux?: readonly string[] | undefined;
  numerosDepartements?: readonly string[] | undefined;
}

/** @internal */
export function rechercheEntrepriseQuery(params: RechercheEntrepriseParams): Record<string, string> {
  const { zone } = params;
  if (zone?.rayon !== undefined && !between(zone.rayon, 1, 500)) {
    throw new InvalidArgumentError('rayon doit être compris entre 1 et 500 km.');
  }
  checkPage(params.page);
  if (params.parPage !== undefined && !between(params.parPage, 1, 250)) {
    throw new InvalidArgumentError('parPage doit être compris entre 1 et 250.');
  }

  return filter({
    query: params.query,
    activite: params.activites?.join(','),
    categorie_juridique: params.categoriesJuridiques?.join(','),
    actif: params.actif?.toString(),
    latitude: zone?.latitude.toString(),
    longitude: zone?.longitude.toString(),
    rayon: zone?.rayon?.toString(),
    page: params.page?.toString(),
    par_page: params.parPage?.toString(),
  });
}

/** @internal */
export function rechercheActiviteQuery(params: RechercheActiviteParams): Record<string, string> {
  if (params.query.trim() === '') {
    throw new InvalidArgumentError('query est obligatoire.');
  }
  checkPage(params.page);
  if (params.parPage !== undefined && !between(params.parPage, 1, 100)) {
    throw new InvalidArgumentError('parPage doit être compris entre 1 et 100.');
  }

  return filter({
    query: params.query,
    section: params.section,
    page: params.page?.toString(),
    par_page: params.parPage?.toString(),
  });
}

/** @internal */
export function etablissementsQuery(params: EtablissementsParams): Record<string, string> {
  return filter({
    actifs: params.actifs?.toString(),
    activites: params.activites?.join(','),
    // Orthographe imposée par l'API.
    code_postaux: params.codesPostaux?.join(','),
    numeros_departements: params.numerosDepartements?.join(','),
  });
}

function checkPage(page: number | undefined): void {
  if (page !== undefined && !(Number.isInteger(page) && page >= 1)) {
    throw new InvalidArgumentError('page doit être supérieure ou égale à 1.');
  }
}

function between(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

/** Retire les critères non renseignés. */
function filter(values: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter((entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== ''),
  );
}
