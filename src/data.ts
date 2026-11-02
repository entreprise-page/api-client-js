/**
 * Lecture typée des réponses JSON décodées, utilisée par les modèles générés.
 *
 * Un champ non nullable absent ou mal typé lève une erreur : cela signale
 * une dérive entre le SDK et l'API plutôt que de la masquer. Les listes `null`
 * (slices nil côté Go) sont lues comme des listes vides.
 *
 * @internal
 * @module
 */

import { UnexpectedResponseError } from './errors.ts';

export type Json = Readonly<Record<string, unknown>>;

export type Factory<T> = (data: Json) => T;

export function string(data: Json, key: string): string {
  const value = data[key];
  if (typeof value !== 'string') {
    throw invalid(key, 'string', value);
  }

  return value;
}

export function nullableString(data: Json, key: string): string | null {
  return data[key] == null ? null : string(data, key);
}

export function int(data: Json, key: string): number {
  const value = data[key];
  if (!Number.isInteger(value)) {
    throw invalid(key, 'int', value);
  }

  return value as number;
}

export function nullableInt(data: Json, key: string): number | null {
  return data[key] == null ? null : int(data, key);
}

export function float(data: Json, key: string): number {
  const value = data[key];
  if (typeof value !== 'number') {
    throw invalid(key, 'float', value);
  }

  return value;
}

export function nullableFloat(data: Json, key: string): number | null {
  return data[key] == null ? null : float(data, key);
}

export function bool(data: Json, key: string): boolean {
  const value = data[key];
  if (typeof value !== 'boolean') {
    throw invalid(key, 'bool', value);
  }

  return value;
}

export function nullableBool(data: Json, key: string): boolean | null {
  return data[key] == null ? null : bool(data, key);
}

export function object<T>(data: Json, key: string, factory: Factory<T>): T {
  const value = data[key];
  if (!isObject(value)) {
    throw invalid(key, 'object', value);
  }

  return factory(value);
}

export function nullableObject<T>(data: Json, key: string, factory: Factory<T>): T | null {
  return data[key] == null ? null : object(data, key, factory);
}

export function objectList<T>(data: Json, key: string, factory: Factory<T>): T[] {
  return list(data, key).map((item) => {
    if (!isObject(item)) {
      throw invalid(`${key}[]`, 'object', item);
    }

    return factory(item);
  });
}

export function stringList(data: Json, key: string): string[] {
  return list(data, key).map((item) => {
    if (typeof item !== 'string') {
      throw invalid(`${key}[]`, 'string', item);
    }

    return item;
  });
}

/**
 * Décode un corps de réponse JSON en objet ou en liste.
 */
export function decode(text: string): Json | unknown[] {
  let decoded: unknown;
  try {
    decoded = JSON.parse(text);
  } catch (error) {
    throw new UnexpectedResponseError(`La réponse de l'API n'est pas un JSON valide : ${(error as Error).message}`, {
      cause: error,
    });
  }

  if (!isObject(decoded) && !Array.isArray(decoded)) {
    throw invalid('(racine)', 'object ou liste', decoded);
  }

  return decoded;
}

/**
 * Applique une fabrique à chaque élément d'une liste JSON racine.
 */
export function mapList<T>(items: unknown, factory: Factory<T>): T[] {
  return objectList({ '(racine)': items }, '(racine)', factory);
}

/**
 * Lit un objet JSON racine.
 */
export function root<T>(value: unknown, factory: Factory<T>): T {
  return object({ '(racine)': value }, '(racine)', factory);
}

function list(data: Json, key: string): unknown[] {
  const value = data[key] ?? [];
  if (!Array.isArray(value)) {
    throw invalid(key, 'list', value);
  }

  return value;
}

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalid(key: string, expected: string, value: unknown): UnexpectedResponseError {
  const received = value === null ? 'null' : Array.isArray(value) ? 'list' : typeof value;

  return new UnexpectedResponseError(`Le champ "${key}" devrait être de type ${expected}, ${received} reçu.`);
}
