import { T, flatten, map, always, pipe, values, mapObjIndexed } from 'ramda';
import { JSON_Pointer, UpdateOperation, EventData, FSM_Model } from '../components/types';
import { assertContract } from './utils';
import { isDefaultActionResponseHandlerConfig } from '../components/typeChecks';
import { DomainActionResponse } from '../types/repository';

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

export function checkActionResponseIsSuccess(model: FSM_Model, actionResponse: DomainActionResponse) {
  void model;
  const { err } = actionResponse;
  return !err;
}

export function makeDefaultActionResponseProcessing(config: any) {
  assertContract(isDefaultActionResponseHandlerConfig, [config], `
Configuration for action response handling must be of the shape :: {
  success : {target_state : <state>, udpate_model : <model update fn>,
  error : {target_state : <state>, udpate_model : <model update fn>
}`);

  const {
          success : { target_state : successTargetState, model_update : successModelUpdate },
          error: { target_state: errorTargetState, model_update: errorModelUpdate }
        } = config;

  return [
    {
      action_guard: checkActionResponseIsSuccess,
      target_state: successTargetState,
      model_update: successModelUpdate
    },
    {
      action_guard: T,
      target_state: errorTargetState,
      model_update: errorModelUpdate
    }
  ]
}

export function chainModelUpdates(arrayModelUpdateFn: Array<Function>) {
  return function chainedModelUpdates(model: FSM_Model, eventData: EventData,
                                      actionResponse: DomainActionResponse, settings:any) {
    return flatten(map(
      (modelUpdateFn: Function) => modelUpdateFn(model, eventData, actionResponse, settings),
      arrayModelUpdateFn)
    )
  }
}

export function getSelectedKey(latestTeamIndex: any, teamKeys: any) {
  return teamKeys[latestTeamIndex];
}

