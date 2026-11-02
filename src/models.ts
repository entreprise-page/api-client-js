// Généré par bin/generate-models.ts depuis api/docs/swagger.json, ne pas modifier à la main.

import * as Data from './data.ts';

export interface ActeAnnonce {
  /**
   * Exemple : "Création d'un fonds de commerce"
   */
  readonly categorieCreation: string | null;
  /**
   * Exemple : "Immatriculation d'une société"
   */
  readonly categorieImmatriculation: string | null;
  /**
   * Exemple : "2020-06-15"
   */
  readonly dateCommencementActivite: string | null;
  /**
   * Exemple : "2020-06-01"
   */
  readonly dateImmatriculation: string | null;
  readonly descriptif: string | null;
  readonly vente: VenteAnnonce | null;
}

/** @internal */
export function readActeAnnonce(data: Data.Json): ActeAnnonce {
  return {
    categorieCreation: Data.nullableString(data, 'categorie_creation'),
    categorieImmatriculation: Data.nullableString(data, 'categorie_immatriculation'),
    dateCommencementActivite: Data.nullableString(data, 'date_commencement_activite'),
    dateImmatriculation: Data.nullableString(data, 'date_immatriculation'),
    descriptif: Data.nullableString(data, 'descriptif'),
    vente: Data.nullableObject(data, 'vente', readVenteAnnonce),
  };
}

export interface Activite {
  /**
   * Exemple : "62.02A"
   */
  readonly code: string;
  /**
   * Exemple : "Conseil en systèmes et logiciels informatiques"
   */
  readonly libelle: string | null;
  /**
   * Exemple : "Programmation, conseil et autres activités informatiques"
   */
  readonly section: string | null;
}

/** @internal */
export function readActivite(data: Data.Json): Activite {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.nullableString(data, 'libelle'),
    section: Data.nullableString(data, 'section'),
  };
}

export interface ActiviteTrouvee {
  /**
   * Exemple : "43.22A"
   */
  readonly code: string;
  /**
   * Exemple : "Travaux d'installation d'eau et de gaz en tous locaux"
   */
  readonly libelle: string | null;
  /**
   * Exemple : "Construction"
   */
  readonly section: string | null;
  /**
   * Exemple : ["plombier","plomberie","dépannage plomberie"]
   */
  readonly motsCles: readonly string[];
  /**
   * Exemple : 0.87
   */
  readonly pertinence: number | null;
}

/** @internal */
export function readActiviteTrouvee(data: Data.Json): ActiviteTrouvee {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.nullableString(data, 'libelle'),
    section: Data.nullableString(data, 'section'),
    motsCles: Data.stringList(data, 'mots_cles'),
    pertinence: Data.nullableFloat(data, 'pertinence'),
  };
}

export interface Adresse {
  /**
   * Exemple : "75009"
   */
  readonly codePostal: string | null;
  readonly commune: Commune | null;
  /**
   * Exemple : "Batiment C"
   */
  readonly complement: string | null;
  readonly coordonnees: Coordonnees | null;
  readonly departement: Departement | null;
  /**
   * Exemple : "8 bis"
   */
  readonly numeroVoie: string | null;
  readonly pays: Pays;
  readonly region: Region | null;
  /**
   * Exemple : "rue DE LONDRES"
   */
  readonly typeEtNomVoie: string | null;
}

/** @internal */
export function readAdresse(data: Data.Json): Adresse {
  return {
    codePostal: Data.nullableString(data, 'code_postal'),
    commune: Data.nullableObject(data, 'commune', readCommune),
    complement: Data.nullableString(data, 'complement'),
    coordonnees: Data.nullableObject(data, 'coordonnees', readCoordonnees),
    departement: Data.nullableObject(data, 'departement', readDepartement),
    numeroVoie: Data.nullableString(data, 'numero_voie'),
    pays: Data.object(data, 'pays', readPays),
    region: Data.nullableObject(data, 'region', readRegion),
    typeEtNomVoie: Data.nullableString(data, 'type_et_nom_voie'),
  };
}

export interface AdresseAnnonce {
  /**
   * Exemple : "BP 42"
   */
  readonly boitePostale: string | null;
  /**
   * Exemple : "75009"
   */
  readonly codePostal: string | null;
  /**
   * Exemple : "Batiment C"
   */
  readonly complement: string | null;
  /**
   * Exemple : "de Londres"
   */
  readonly nomVoie: string | null;
  /**
   * Exemple : "8 bis"
   */
  readonly numeroVoie: string | null;
  /**
   * Exemple : "France"
   */
  readonly pays: string | null;
  /**
   * Exemple : "rue"
   */
  readonly typeVoie: string | null;
  /**
   * Exemple : "Paris"
   */
  readonly ville: string | null;
  /**
   * Exemple : "8 bis rue de Londres"
   */
  readonly voie: string | null;
}

/** @internal */
export function readAdresseAnnonce(data: Data.Json): AdresseAnnonce {
  return {
    boitePostale: Data.nullableString(data, 'boite_postale'),
    codePostal: Data.nullableString(data, 'code_postal'),
    complement: Data.nullableString(data, 'complement'),
    nomVoie: Data.nullableString(data, 'nom_voie'),
    numeroVoie: Data.nullableString(data, 'numero_voie'),
    pays: Data.nullableString(data, 'pays'),
    typeVoie: Data.nullableString(data, 'type_voie'),
    ville: Data.nullableString(data, 'ville'),
    voie: Data.nullableString(data, 'voie'),
  };
}

export interface Annonce {
  /**
   * Exemple : "A202001221441"
   */
  readonly id: string;
  /**
   * Exemple : "vente"
   */
  readonly famille: string;
  /**
   * Exemple : "annonce"
   */
  readonly typeAvis: string;
  /**
   * Exemple : "2020-06-28"
   */
  readonly dateParution: string | null;
  readonly acte: ActeAnnonce | null;
  readonly avisPrecedent: AvisPrecedentAnnonce | null;
  readonly depot: DepotAnnonce | null;
  readonly etablissement: EtablissementAnnonce | null;
  readonly jugement: JugementAnnonce | null;
  readonly modification: ModificationAnnonce | null;
  /**
   * Exemple : "75"
   */
  readonly numeroDepartement: string | null;
  readonly parution: ParutionAnnonce;
  readonly personnes: readonly PersonneAnnonce[];
  readonly precedentsExploitants: readonly PersonneAnnonce[];
  readonly precedentsProprietaires: readonly PersonneAnnonce[];
  readonly radiation: RadiationAnnonce | null;
  /**
   * Exemple : "Paris"
   */
  readonly tribunal: string | null;
}

/** @internal */
export function readAnnonce(data: Data.Json): Annonce {
  return {
    id: Data.string(data, 'id'),
    famille: Data.string(data, 'famille'),
    typeAvis: Data.string(data, 'type_avis'),
    dateParution: Data.nullableString(data, 'date_parution'),
    acte: Data.nullableObject(data, 'acte', readActeAnnonce),
    avisPrecedent: Data.nullableObject(data, 'avis_precedent', readAvisPrecedentAnnonce),
    depot: Data.nullableObject(data, 'depot', readDepotAnnonce),
    etablissement: Data.nullableObject(data, 'etablissement', readEtablissementAnnonce),
    jugement: Data.nullableObject(data, 'jugement', readJugementAnnonce),
    modification: Data.nullableObject(data, 'modification', readModificationAnnonce),
    numeroDepartement: Data.nullableString(data, 'numero_departement'),
    parution: Data.object(data, 'parution', readParutionAnnonce),
    personnes: Data.objectList(data, 'personnes', readPersonneAnnonce),
    precedentsExploitants: Data.objectList(data, 'precedents_exploitants', readPersonneAnnonce),
    precedentsProprietaires: Data.objectList(data, 'precedents_proprietaires', readPersonneAnnonce),
    radiation: Data.nullableObject(data, 'radiation', readRadiationAnnonce),
    tribunal: Data.nullableString(data, 'tribunal'),
  };
}

export interface AvisPrecedentAnnonce {
  /**
   * Exemple : "2020-05-14"
   */
  readonly dateParution: string | null;
  /**
   * Exemple : "BODACC A"
   */
  readonly nomPublication: string;
  /**
   * Exemple : "1337"
   */
  readonly numeroAnnonce: string;
  /**
   * Exemple : "20200100"
   */
  readonly numeroParution: string;
}

/** @internal */
export function readAvisPrecedentAnnonce(data: Data.Json): AvisPrecedentAnnonce {
  return {
    dateParution: Data.nullableString(data, 'date_parution'),
    nomPublication: Data.string(data, 'nom_publication'),
    numeroAnnonce: Data.string(data, 'numero_annonce'),
    numeroParution: Data.string(data, 'numero_parution'),
  };
}

export interface CapitalAnnonce {
  /**
   * Exemple : "EUR"
   */
  readonly devise: string;
  /**
   * Exemple : false
   */
  readonly estVariable: boolean;
  /**
   * Exemple : 10000
   */
  readonly montant: number;
}

/** @internal */
export function readCapitalAnnonce(data: Data.Json): CapitalAnnonce {
  return {
    devise: Data.string(data, 'devise'),
    estVariable: Data.bool(data, 'est_variable'),
    montant: Data.float(data, 'montant'),
  };
}

export interface Commune {
  /**
   * Exemple : "75009"
   */
  readonly code: string;
  /**
   * Exemple : "Paris"
   */
  readonly libelle: string;
}

/** @internal */
export function readCommune(data: Data.Json): Commune {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface Convention {
  /**
   * Exemple : 1486
   */
  readonly idcc: number;
  /**
   * Exemple : "Bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils(BET, SYNTEC)"
   */
  readonly libelle: string;
}

/** @internal */
export function readConvention(data: Data.Json): Convention {
  return {
    idcc: Data.int(data, 'idcc'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface Coordonnees {
  /**
   * Exemple : 45.7672724
   */
  readonly latitude: number;
  /**
   * Exemple : 4.8340594
   */
  readonly longitude: number;
}

/** @internal */
export function readCoordonnees(data: Data.Json): Coordonnees {
  return {
    latitude: Data.float(data, 'latitude'),
    longitude: Data.float(data, 'longitude'),
  };
}

export interface Departement {
  /**
   * Exemple : "75"
   */
  readonly code: string;
  /**
   * Exemple : "Seine"
   */
  readonly libelle: string;
}

/** @internal */
export function readDepartement(data: Data.Json): Departement {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface DepotAnnonce {
  /**
   * Exemple : "2019-12-31"
   */
  readonly dateCloture: string | null;
  readonly descriptif: string | null;
  /**
   * Exemple : "Comptes annuels et rapports"
   */
  readonly typeDepot: string | null;
}

/** @internal */
export function readDepotAnnonce(data: Data.Json): DepotAnnonce {
  return {
    dateCloture: Data.nullableString(data, 'date_cloture'),
    descriptif: Data.nullableString(data, 'descriptif'),
    typeDepot: Data.nullableString(data, 'type_depot'),
  };
}

export interface Dirigeant {
  readonly personneMorale: readonly PersonneMorale[];
  readonly personnePhysique: readonly PersonnePhysique[];
}

/** @internal */
export function readDirigeant(data: Data.Json): Dirigeant {
  return {
    personneMorale: Data.objectList(data, 'personne_morale', readPersonneMorale),
    personnePhysique: Data.objectList(data, 'personne_physique', readPersonnePhysique),
  };
}

export interface Effectif {
  /**
   * Exemple : true
   */
  readonly estEmployeur: boolean;
  readonly historiques: readonly EffectifAnnee[];
}

/** @internal */
export function readEffectif(data: Data.Json): Effectif {
  return {
    estEmployeur: Data.bool(data, 'est_employeur'),
    historiques: Data.objectList(data, 'historiques', readEffectifAnnee),
  };
}

export interface EffectifAnnee {
  /**
   * Exemple : 2025
   */
  readonly annee: number;
  /**
   * Exemple : 42
   */
  readonly code: number;
  /**
   * Exemple : 1999
   */
  readonly max: number;
  /**
   * Exemple : 1000
   */
  readonly min: number;
}

/** @internal */
export function readEffectifAnnee(data: Data.Json): EffectifAnnee {
  return {
    annee: Data.int(data, 'annee'),
    code: Data.int(data, 'code'),
    max: Data.int(data, 'max'),
    min: Data.int(data, 'min'),
  };
}

export interface Entreprise {
  /**
   * Exemple : "443061841"
   */
  readonly siren: string;
  /**
   * Exemple : "Google France"
   */
  readonly denominationSociale: string | null;
  readonly activitePrincipaleExercee: Activite;
  /**
   * Exemple : 1000000
   */
  readonly capitalSocial: number | null;
  readonly conventions: readonly Convention[];
  /**
   * Exemple : "2006-02-08"
   */
  readonly dateCessation: string | null;
  /**
   * Exemple : "2002-05-16"
   */
  readonly dateCreation: string | null;
  readonly dirigeant: Dirigeant;
  readonly effectif: Effectif;
  readonly finances: readonly Finance[];
  readonly formeJuridique: FormeJuridique;
  /**
   * Exemple : "Paris"
   */
  readonly greffe: string | null;
  /**
   * Exemple : "W751017910"
   */
  readonly identifiantAssociation: string | null;
  readonly meta: Meta;
  /**
   * Exemple : "FR64443061841"
   */
  readonly numeroTva: string;
  readonly registre: Registre;
  readonly siegeSocial: Etablissement | null;
}

/** @internal */
export function readEntreprise(data: Data.Json): Entreprise {
  return {
    siren: Data.string(data, 'siren'),
    denominationSociale: Data.nullableString(data, 'denomination_sociale'),
    activitePrincipaleExercee: Data.object(data, 'activite_principale_exercee', readActivite),
    capitalSocial: Data.nullableFloat(data, 'capital_social'),
    conventions: Data.objectList(data, 'conventions', readConvention),
    dateCessation: Data.nullableString(data, 'date_cessation'),
    dateCreation: Data.nullableString(data, 'date_creation'),
    dirigeant: Data.object(data, 'dirigeant', readDirigeant),
    effectif: Data.object(data, 'effectif', readEffectif),
    finances: Data.objectList(data, 'finances', readFinance),
    formeJuridique: Data.object(data, 'forme_juridique', readFormeJuridique),
    greffe: Data.nullableString(data, 'greffe'),
    identifiantAssociation: Data.nullableString(data, 'identifiant_association'),
    meta: Data.object(data, 'meta', readMeta),
    numeroTva: Data.string(data, 'numero_tva'),
    registre: Data.object(data, 'registre', readRegistre),
    siegeSocial: Data.nullableObject(data, 'siege_social', readEtablissement),
  };
}

export interface Etablissement {
  readonly activitePrincipaleExercee: Activite;
  readonly adresse: Adresse;
  readonly conventionCollective: Convention | null;
  /**
   * Exemple : "FRGOOGLE"
   */
  readonly enseigne: string | null;
  /**
   * Exemple : true
   */
  readonly estActif: boolean;
  /**
   * Exemple : true
   */
  readonly estSiege: boolean;
  /**
   * Exemple : ["google.fr"]
   */
  readonly nomsDeDomaine: readonly string[];
  /**
   * Exemple : "44306184100047"
   */
  readonly siret: string;
}

/** @internal */
export function readEtablissement(data: Data.Json): Etablissement {
  return {
    activitePrincipaleExercee: Data.object(data, 'activite_principale_exercee', readActivite),
    adresse: Data.object(data, 'adresse', readAdresse),
    conventionCollective: Data.nullableObject(data, 'convention_collective', readConvention),
    enseigne: Data.nullableString(data, 'enseigne'),
    estActif: Data.bool(data, 'est_actif'),
    estSiege: Data.bool(data, 'est_siege'),
    nomsDeDomaine: Data.stringList(data, 'noms_de_domaine'),
    siret: Data.string(data, 'siret'),
  };
}

export interface EtablissementAnnonce {
  /**
   * Exemple : "restauration rapide"
   */
  readonly activite: string | null;
  readonly adresse: AdresseAnnonce | null;
  /**
   * Exemple : "Chez Jean"
   */
  readonly enseigne: string | null;
  /**
   * Exemple : "Création"
   */
  readonly origineFonds: string | null;
  /**
   * Exemple : "Etablissement principal"
   */
  readonly qualite: string | null;
}

/** @internal */
export function readEtablissementAnnonce(data: Data.Json): EtablissementAnnonce {
  return {
    activite: Data.nullableString(data, 'activite'),
    adresse: Data.nullableObject(data, 'adresse', readAdresseAnnonce),
    enseigne: Data.nullableString(data, 'enseigne'),
    origineFonds: Data.nullableString(data, 'origine_fonds'),
    qualite: Data.nullableString(data, 'qualite'),
  };
}

export interface Finance {
  /**
   * Exemple : 2025
   */
  readonly annee: number;
  /**
   * Exemple : 568000
   */
  readonly chiffreAffaire: number;
  /**
   * Exemple : 268000
   */
  readonly margeBrut: number;
  /**
   * Exemple : 368000
   */
  readonly resultatNet: number;
}

/** @internal */
export function readFinance(data: Data.Json): Finance {
  return {
    annee: Data.int(data, 'annee'),
    chiffreAffaire: Data.float(data, 'chiffre_affaire'),
    margeBrut: Data.float(data, 'marge_brut'),
    resultatNet: Data.float(data, 'resultat_net'),
  };
}

export interface FormeJuridique {
  /**
   * Exemple : "EURL"
   */
  readonly abreviation: string | null;
  /**
   * Exemple : 5499
   */
  readonly code: number;
  /**
   * Exemple : "entreprise unipersonnelle à responsabilité limitée"
   */
  readonly libelle: string;
}

/** @internal */
export function readFormeJuridique(data: Data.Json): FormeJuridique {
  return {
    abreviation: Data.nullableString(data, 'abreviation'),
    code: Data.int(data, 'code'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface JugementAnnonce {
  readonly complement: string | null;
  /**
   * Exemple : "2020-06-18"
   */
  readonly date: string | null;
  /**
   * Exemple : "Jugement d'ouverture"
   */
  readonly famille: string;
  /**
   * Exemple : "Liquidation judiciaire"
   */
  readonly nature: string;
}

/** @internal */
export function readJugementAnnonce(data: Data.Json): JugementAnnonce {
  return {
    complement: Data.nullableString(data, 'complement'),
    date: Data.nullableString(data, 'date'),
    famille: Data.string(data, 'famille'),
    nature: Data.string(data, 'nature'),
  };
}

export interface Meta {
  /**
   * toto: ajouter l'annee de la categorie
   * Exemple : "PME"
   */
  readonly categorieEntreprise: string;
  /**
   * Exemple : true
   */
  readonly estActif: boolean;
  /**
   * Exemple : true
   */
  readonly estDiffusable: boolean;
  /**
   * Exemple : "google-france-443061841"
   */
  readonly slug: string;
  /**
   * todo: compter uniquement les actifs
   * Exemple : 15
   */
  readonly totalEtablissementActif: number;
}

/** @internal */
export function readMeta(data: Data.Json): Meta {
  return {
    categorieEntreprise: Data.string(data, 'categorie_entreprise'),
    estActif: Data.bool(data, 'est_actif'),
    estDiffusable: Data.bool(data, 'est_diffusable'),
    slug: Data.string(data, 'slug'),
    totalEtablissementActif: Data.int(data, 'total_etablissement_actif'),
  };
}

export interface ModificationAnnonce {
  /**
   * Exemple : "2020-06-15"
   */
  readonly dateCommencementActivite: string | null;
  /**
   * Exemple : "2020-06-20"
   */
  readonly dateEffet: string | null;
  readonly descriptif: string | null;
}

/** @internal */
export function readModificationAnnonce(data: Data.Json): ModificationAnnonce {
  return {
    dateCommencementActivite: Data.nullableString(data, 'date_commencement_activite'),
    dateEffet: Data.nullableString(data, 'date_effet'),
    descriptif: Data.nullableString(data, 'descriptif'),
  };
}

export interface ParutionAnnonce {
  /**
   * Exemple : "2020-06-28"
   */
  readonly date: string | null;
  /**
   * Exemple : "20200122"
   */
  readonly numero: string;
  /**
   * Exemple : 1441
   */
  readonly numeroAnnonce: number;
  /**
   * Exemple : "A"
   */
  readonly publication: string;
  /**
   * Exemple : "https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:A202001221441"
   */
  readonly url: string;
}

/** @internal */
export function readParutionAnnonce(data: Data.Json): ParutionAnnonce {
  return {
    date: Data.nullableString(data, 'date'),
    numero: Data.string(data, 'numero'),
    numeroAnnonce: Data.int(data, 'numero_annonce'),
    publication: Data.string(data, 'publication'),
    url: Data.string(data, 'url'),
  };
}

export interface Pays {
  /**
   * Exemple : "FR"
   */
  readonly code: string;
  /**
   * Exemple : "France"
   */
  readonly libelle: string;
}

/** @internal */
export function readPays(data: Data.Json): Pays {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface PersonneAnnonce {
  /**
   * Exemple : "restauration rapide"
   */
  readonly activite: string | null;
  /**
   * Exemple : "Gérant : Jean Dupont"
   */
  readonly administration: string | null;
  readonly adresse: AdresseAnnonce | null;
  readonly capital: CapitalAnnonce | null;
  /**
   * Exemple : "Google France"
   */
  readonly denomination: string | null;
  /**
   * Exemple : false
   */
  readonly estNonInscrit: boolean;
  /**
   * Exemple : "Société par actions simplifiée"
   */
  readonly formeJuridique: string | null;
  /**
   * Exemple : "Paris"
   */
  readonly greffe: string | null;
  /**
   * Exemple : "Google France"
   */
  readonly libelle: string;
  /**
   * Exemple : "Dupont"
   */
  readonly nom: string | null;
  /**
   * Exemple : "Chez Jean"
   */
  readonly nomCommercial: string | null;
  /**
   * Exemple : "Durand"
   */
  readonly nomUsage: string | null;
  /**
   * Exemple : "Jean"
   */
  readonly prenom: string | null;
  /**
   * Exemple : "GF"
   */
  readonly sigle: string | null;
  /**
   * Exemple : "443061841"
   */
  readonly siren: string | null;
  /**
   * Exemple : "pm"
   */
  readonly typePersonne: string;
}

/** @internal */
export function readPersonneAnnonce(data: Data.Json): PersonneAnnonce {
  return {
    activite: Data.nullableString(data, 'activite'),
    administration: Data.nullableString(data, 'administration'),
    adresse: Data.nullableObject(data, 'adresse', readAdresseAnnonce),
    capital: Data.nullableObject(data, 'capital', readCapitalAnnonce),
    denomination: Data.nullableString(data, 'denomination'),
    estNonInscrit: Data.bool(data, 'est_non_inscrit'),
    formeJuridique: Data.nullableString(data, 'forme_juridique'),
    greffe: Data.nullableString(data, 'greffe'),
    libelle: Data.string(data, 'libelle'),
    nom: Data.nullableString(data, 'nom'),
    nomCommercial: Data.nullableString(data, 'nom_commercial'),
    nomUsage: Data.nullableString(data, 'nom_usage'),
    prenom: Data.nullableString(data, 'prenom'),
    sigle: Data.nullableString(data, 'sigle'),
    siren: Data.nullableString(data, 'siren'),
    typePersonne: Data.string(data, 'type_personne'),
  };
}

export interface PersonneMorale {
  /**
   * Exemple : "ERNST & YOUNG ET AUTRES"
   */
  readonly denomination: string;
  /**
   * Exemple : "Commissaire aux comptes titulaire"
   */
  readonly role: string | null;
  /**
   * Exemple : "438476913"
   */
  readonly siren: string | null;
}

/** @internal */
export function readPersonneMorale(data: Data.Json): PersonneMorale {
  return {
    denomination: Data.string(data, 'denomination'),
    role: Data.nullableString(data, 'role'),
    siren: Data.nullableString(data, 'siren'),
  };
}

export interface PersonnePhysique {
  /**
   * Exemple : "1980-01"
   */
  readonly dateNaissance: string | null;
  /**
   * Exemple : "Dupont"
   */
  readonly nom: string;
  /**
   * Exemple : "Pierre"
   */
  readonly prenom: string | null;
  /**
   * Exemple : "Chef d'entreprise"
   */
  readonly role: string | null;
}

/** @internal */
export function readPersonnePhysique(data: Data.Json): PersonnePhysique {
  return {
    dateNaissance: Data.nullableString(data, 'date_naissance'),
    nom: Data.string(data, 'nom'),
    prenom: Data.nullableString(data, 'prenom'),
    role: Data.nullableString(data, 'role'),
  };
}

export interface Quota {
  readonly max: number;
  readonly total: number;
}

/** @internal */
export function readQuota(data: Data.Json): Quota {
  return {
    max: Data.int(data, 'max'),
    total: Data.int(data, 'total'),
  };
}

export interface RadiationAnnonce {
  readonly commentaire: string | null;
  /**
   * Exemple : "2020-05-31"
   */
  readonly dateCessationActivite: string | null;
  /**
   * Exemple : "2020-06-10"
   */
  readonly dateRadiation: string | null;
}

/** @internal */
export function readRadiationAnnonce(data: Data.Json): RadiationAnnonce {
  return {
    commentaire: Data.nullableString(data, 'commentaire'),
    dateCessationActivite: Data.nullableString(data, 'date_cessation_activite'),
    dateRadiation: Data.nullableString(data, 'date_radiation'),
  };
}

export interface RechercheActivite {
  readonly page: number;
  readonly nombreParPage: number;
  readonly totalResultats: number;
  readonly resultats: readonly ActiviteTrouvee[];
}

/** @internal */
export function readRechercheActivite(data: Data.Json): RechercheActivite {
  return {
    page: Data.int(data, 'page'),
    nombreParPage: Data.int(data, 'nombre_par_page'),
    totalResultats: Data.int(data, 'total_resultats'),
    resultats: Data.objectList(data, 'resultats', readActiviteTrouvee),
  };
}

export interface RechercheEntreprise {
  readonly nombreParPage: number;
  readonly page: number;
  readonly resultats: readonly ResultatRecherche[];
  readonly totalPages: number;
  readonly totalResultats: number;
}

/** @internal */
export function readRechercheEntreprise(data: Data.Json): RechercheEntreprise {
  return {
    nombreParPage: Data.int(data, 'nombre_par_page'),
    page: Data.int(data, 'page'),
    resultats: Data.objectList(data, 'resultats', readResultatRecherche),
    totalPages: Data.int(data, 'total_pages'),
    totalResultats: Data.int(data, 'total_resultats'),
  };
}

export interface Region {
  /**
   * Exemple : "11"
   */
  readonly code: string;
  /**
   * Exemple : "Île-de-France"
   */
  readonly libelle: string;
}

/** @internal */
export function readRegion(data: Data.Json): Region {
  return {
    code: Data.string(data, 'code'),
    libelle: Data.string(data, 'libelle'),
  };
}

export interface Registre {
  readonly insee: RegistreDate;
  readonly rcs: RegistreDateCessation | null;
  readonly rne: RegistreDateCessation | null;
}

/** @internal */
export function readRegistre(data: Data.Json): Registre {
  return {
    insee: Data.object(data, 'insee', readRegistreDate),
    rcs: Data.nullableObject(data, 'rcs', readRegistreDateCessation),
    rne: Data.nullableObject(data, 'rne', readRegistreDateCessation),
  };
}

export interface RegistreDate {
  /**
   * Exemple : "2002-08-14"
   */
  readonly dateCreation: string | null;
  /**
   * Exemple : "2002-08-14"
   */
  readonly dateMiseAJour: string | null;
}

/** @internal */
export function readRegistreDate(data: Data.Json): RegistreDate {
  return {
    dateCreation: Data.nullableString(data, 'date_creation'),
    dateMiseAJour: Data.nullableString(data, 'date_mise_a_jour'),
  };
}

export interface RegistreDateCessation {
  /**
   * Exemple : "2002-08-14"
   */
  readonly dateCessation: string | null;
  /**
   * Exemple : "2002-08-14"
   */
  readonly dateCreation: string | null;
  /**
   * Exemple : "2002-08-14"
   */
  readonly dateMiseAJour: string | null;
}

/** @internal */
export function readRegistreDateCessation(data: Data.Json): RegistreDateCessation {
  return {
    dateCessation: Data.nullableString(data, 'date_cessation'),
    dateCreation: Data.nullableString(data, 'date_creation'),
    dateMiseAJour: Data.nullableString(data, 'date_mise_a_jour'),
  };
}

export interface ResultatRecherche {
  /**
   * Exemple : "443061841"
   */
  readonly siren: string;
  /**
   * Exemple : "Google France"
   */
  readonly denominationSociale: string | null;
  readonly activitePrincipaleExercee: Activite;
  /**
   * Exemple : 1000000
   */
  readonly capitalSocial: number | null;
  readonly conventions: readonly Convention[];
  /**
   * Exemple : "2006-02-08"
   */
  readonly dateCessation: string | null;
  /**
   * Exemple : "2002-05-16"
   */
  readonly dateCreation: string | null;
  readonly dirigeant: Dirigeant;
  /**
   * Distance en mètres entre le point de recherche et l'établissement le plus proche, absente hors recherche géographique.
   * Exemple : 4200
   */
  readonly distanceMetres: number | null;
  readonly effectif: Effectif;
  /**
   * Établissement actif le plus proche du point de recherche, celui qui a fait ressortir l'entreprise : ce n'est pas forcément le siège social.
   */
  readonly etablissementLePlusProche: Etablissement | null;
  readonly finances: readonly Finance[];
  readonly formeJuridique: FormeJuridique;
  /**
   * Exemple : "Paris"
   */
  readonly greffe: string | null;
  /**
   * Exemple : "W751017910"
   */
  readonly identifiantAssociation: string | null;
  readonly meta: Meta;
  /**
   * Exemple : "FR64443061841"
   */
  readonly numeroTva: string;
  readonly registre: Registre;
  readonly siegeSocial: Etablissement | null;
}

/** @internal */
export function readResultatRecherche(data: Data.Json): ResultatRecherche {
  return {
    siren: Data.string(data, 'siren'),
    denominationSociale: Data.nullableString(data, 'denomination_sociale'),
    activitePrincipaleExercee: Data.object(data, 'activite_principale_exercee', readActivite),
    capitalSocial: Data.nullableFloat(data, 'capital_social'),
    conventions: Data.objectList(data, 'conventions', readConvention),
    dateCessation: Data.nullableString(data, 'date_cessation'),
    dateCreation: Data.nullableString(data, 'date_creation'),
    dirigeant: Data.object(data, 'dirigeant', readDirigeant),
    distanceMetres: Data.nullableInt(data, 'distance_metres'),
    effectif: Data.object(data, 'effectif', readEffectif),
    etablissementLePlusProche: Data.nullableObject(data, 'etablissement_le_plus_proche', readEtablissement),
    finances: Data.objectList(data, 'finances', readFinance),
    formeJuridique: Data.object(data, 'forme_juridique', readFormeJuridique),
    greffe: Data.nullableString(data, 'greffe'),
    identifiantAssociation: Data.nullableString(data, 'identifiant_association'),
    meta: Data.object(data, 'meta', readMeta),
    numeroTva: Data.string(data, 'numero_tva'),
    registre: Data.object(data, 'registre', readRegistre),
    siegeSocial: Data.nullableObject(data, 'siege_social', readEtablissement),
  };
}

export interface Suggestion {
  /**
   * Exemple : "443061841"
   */
  readonly siren: string;
  /**
   * Exemple : "Google France"
   */
  readonly nom: string;
  /**
   * Exemple : "75009"
   */
  readonly localite: string;
  /**
   * Exemple : "Programmation, conseil et autres activités informatiques"
   */
  readonly activite: string;
  /**
   * Exemple : true
   */
  readonly active: boolean;
  /**
   * Exemple : "google-france-443061841"
   */
  readonly slug: string;
}

/** @internal */
export function readSuggestion(data: Data.Json): Suggestion {
  return {
    siren: Data.string(data, 'siren'),
    nom: Data.string(data, 'nom'),
    localite: Data.string(data, 'localite'),
    activite: Data.string(data, 'activite'),
    active: Data.bool(data, 'active'),
    slug: Data.string(data, 'slug'),
  };
}

export interface VenteAnnonce {
  /**
   * Exemple : "Vente"
   */
  readonly categorie: string | null;
  /**
   * Exemple : "2020-06-20"
   */
  readonly dateEffet: string | null;
  /**
   * Exemple : "2020-06-22"
   */
  readonly datePublicite: string | null;
  readonly oppositions: readonly string[];
  readonly publiciteLegale: string | null;
}

/** @internal */
export function readVenteAnnonce(data: Data.Json): VenteAnnonce {
  return {
    categorie: Data.nullableString(data, 'categorie'),
    dateEffet: Data.nullableString(data, 'date_effet'),
    datePublicite: Data.nullableString(data, 'date_publicite'),
    oppositions: Data.stringList(data, 'oppositions'),
    publiciteLegale: Data.nullableString(data, 'publicite_legale'),
  };
}
