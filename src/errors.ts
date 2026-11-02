/**
 * Erreur de base du SDK : toutes les erreurs levées en héritent.
 */
export class EntreprisePageError extends Error {
  override name = 'EntreprisePageError';
}

/**
 * L'API a répondu avec un statut d'erreur (4xx ou 5xx).
 */
export class ApiError extends EntreprisePageError {
  override name = 'ApiError';

  readonly status: number;
  /** Corps brut de la réponse. */
  readonly body: string;
  readonly response: Response;

  constructor(message: string, response: Response, body: string) {
    super(message);
    this.status = response.status;
    this.body = body;
    this.response = response;
  }

  static fromResponse(response: Response, body: string): ApiError {
    const message = extractMessage(response, body);
    const status = response.status;

    if (status === 400) {
      return new BadRequestError(message, response, body);
    }
    if (status === 401 || status === 403) {
      return new UnauthorizedError(message, response, body);
    }
    if (status === 404) {
      return new NotFoundError(message, response, body);
    }
    if (status === 429) {
      return new TooManyRequestsError(message, response, body);
    }
    if (status >= 500) {
      return new ServerError(message, response, body);
    }

    return new ApiError(message, response, body);
  }
}

export class BadRequestError extends ApiError {
  override name = 'BadRequestError';
}

/** Clé d'API absente, inconnue, ou plan qui ne donne pas accès à l'endpoint (401/403). */
export class UnauthorizedError extends ApiError {
  override name = 'UnauthorizedError';
}

export class NotFoundError extends ApiError {
  override name = 'NotFoundError';
}

/** Quota de la clé d'API dépassé. */
export class TooManyRequestsError extends ApiError {
  override name = 'TooManyRequestsError';
}

export class ServerError extends ApiError {
  override name = 'ServerError';
}

/**
 * Aucune réponse reçue : réseau, timeout, requête annulée ou, dans un navigateur, requête bloquée par CORS.
 */
export class TransportError extends EntreprisePageError {
  override name = 'TransportError';
}

/**
 * Réponse qui ne respecte pas le contrat (JSON invalide, champ manquant ou mal typé).
 */
export class UnexpectedResponseError extends EntreprisePageError {
  override name = 'UnexpectedResponseError';
}

/**
 * Paramètres invalides, détectés avant l'envoi.
 */
export class InvalidArgumentError extends EntreprisePageError {
  override name = 'InvalidArgumentError';
}

/**
 * L'API renvoie soit une chaîne JSON (`"message"`), soit un objet `{"error": "message"}`.
 */
function extractMessage(response: Response, body: string): string {
  const fallback = `L'API a répondu ${response.status} ${response.statusText}`.trimEnd();

  let decoded: unknown;
  try {
    decoded = JSON.parse(body);
  } catch {
    return body.trim() !== '' ? body.trim() : fallback;
  }

  if (typeof decoded === 'string' && decoded !== '') {
    return decoded;
  }
  if (typeof decoded === 'object' && decoded !== null && typeof (decoded as { error?: unknown }).error === 'string') {
    return (decoded as { error: string }).error;
  }

  return fallback;
}
