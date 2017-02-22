import { always, pipe, values, mapObjIndexed } from 'ramda';
import { JSON_Pointer, UpdateOperation } from '../components/types';

export const modelUpdateIdentity = always([]);

// NOTE!! the object passed as parameer must be a non-empty object!!
// TODO : rewrite this properly to add an exception in case of misuse
export const toJsonPatch = (path: JSON_Pointer) => pipe(mapObjIndexed((value, key) => ({
  op: "add",
  path: [path, key].join('/'),
  value: value
} as UpdateOperation)), values);

export function addOpToJsonPatch(path: string, value: any) {
  return [{
    op: "add",
    path: path,
    value: value
  } as UpdateOperation]
}
