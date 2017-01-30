import { always, pipe, values, mapObjIndexed } from 'ramda';
import { JSON_Pointer, UpdateOperation } from '../components/types';

export const modelUpdateIdentity = always([]);

export const toJsonPatch = (path: JSON_Pointer) => pipe(mapObjIndexed((value, key) => ({
  op: "add",
  path: [path, key].join('/'),
  value: value
} as UpdateOperation)), values);
