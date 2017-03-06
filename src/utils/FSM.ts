import {
  evolve, map, mapObjIndexed, flatten, values, pipe, isNil, T, identity, cond, always
} from 'ramda';
import { JSON_Pointer, UpdateOperation, EventData, FSM_Model } from '../components/types';
import {
  assertContract, decorateWith, assertFunctionContractDecoratorSpecs, logFnTrace, isFunction
} from './utils';
import {
  isDefaultActionResponseHandlerConfig, isActionGuardDomain, isActionGuardCodomain,
  isModelUpdateDomain, isModelUpdateCodomain, isEventGuardDomain, isEventGuardCodomain,
  isActionRequestDomain, isActionRequestCodomain, isEventFactoryDomain, isEventFactoryCodomain,
  isFsmModel
} from '../components/typeChecks';
import { DomainActionResponse } from '../types/repository';

export function modelUpdateIdentity() {
  return []
}

// NOTE!! the object passed as parameter must be a non-empty object!!
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
                                      actionResponse: DomainActionResponse, settings: any) {
    return flatten(map(
      (modelUpdateFn: Function) => modelUpdateFn(model, eventData, actionResponse, settings),
      arrayModelUpdateFn)
    )
  }
}

export function getSelectedKey(latestTeamIndex: any, teamKeys: any) {
  return teamKeys[latestTeamIndex];
}

// Decorators to add log, contract checking, and tracing capabilities to fsm functions
export const tapEventStreamOutput = (eventName: string) => ({
  after: (result: any) => result.tap(console.warn.bind(console, `Incoming user event! ${eventName}: `))
});

export const decorateStateEntryWithLog = mapObjIndexed((stateEntryComponent, state) => stateEntryComponent
  ? decorateWith([
    assertFunctionContractDecoratorSpecs({
      checkDomain: isEntryComponentDomain,
      checkCodomain: isEntryComponentCodomain
    }),
    logFnTrace(`.STATE. ${state}`, ['model']),
  ], stateEntryComponent)
  : null
);

export const isEntryComponentDomain = isFsmModel;
export const isEntryComponentCodomain = isFunction;

export const decorateEventsWithLog = mapObjIndexed((eventFactory, eventName) =>
  decorateWith([
    assertFunctionContractDecoratorSpecs({
      checkDomain: isEventFactoryDomain,
      checkCodomain: isEventFactoryCodomain
    }),
    logFnTrace('Event factory', ['sources', 'settings']),
    tapEventStreamOutput(eventName)
  ], eventFactory)
);

export const decorateEventGuard = decorateWith([
  assertFunctionContractDecoratorSpecs({
    checkDomain: isEventGuardDomain,
    checkCodomain: isEventGuardCodomain
  }),
  logFnTrace('Event guard', ['FSM_Model', 'EventData']),
]);

export const decorateActionRequest = decorateWith([
  assertFunctionContractDecoratorSpecs({
    checkDomain: isActionRequestDomain,
    checkCodomain: isActionRequestCodomain
  }),
  logFnTrace('action request', ['FSM_Model', 'EventData']),
]);

const decorateActionGuard = decorateWith([
  assertFunctionContractDecoratorSpecs({
    checkDomain: isActionGuardDomain,
    checkCodomain: isActionGuardCodomain
  }),
  logFnTrace('action guard', ['model', 'actionResponse']),
]);

// Hand forced by ts, apparently because of evolve typing and cond
interface dummyFn {
  ({}:any): any
}

const decorateModelUpdate: dummyFn = decorateWith([
  assertFunctionContractDecoratorSpecs({
    checkDomain: isModelUpdateDomain,
    checkCodomain: isModelUpdateCodomain
  }),
  logFnTrace('model update', ['FSM_Model', 'EventData', 'ActionResponse', 'Settings']),
]);

const decorateTransEval = evolve<any>({
  target_state: identity,
  action_guard: cond([[isNil, always(null)], [T, decorateActionGuard]]) as dummyFn,
  model_update: decorateModelUpdate
});

const decorateTransition = evolve<any>({
  re_entry: identity,
  transition_evaluation: map(decorateTransEval),
  event_guard: cond([[isNil, always(null)], [T, decorateEventGuard]]) as dummyFn,
  action_request: cond([[isNil, always(null)], [T, evolve({
    driver: identity,
    request: decorateActionRequest
  })]]) as dummyFn,
});

export const decorateTransitionsWithLog = mapObjIndexed(evolve({
  origin_state: identity,
  event: identity,
  target_states: map(decorateTransition)
}));
