import {
  map as mapR, reduce as reduceR, mapObjIndexed, uniq, flatten, values, find, equals, clone, keys,
  filter, always, curry, defaultTo, findIndex, tryCatch, either, isNil, pipe
} from 'ramda';
import { checkSignature, assertContract, handleError, isBoolean } from '../utils/utils';
import {
  isFsmSettings, isFsmEvents, isFsmTransitions, isFsmEntryComponents,
  checkTargetStatesDefinedInTransitionsMustBeMappedToComponent,
  checkOriginStatesDefinedInTransitionsMustBeMappedToComponent,
  checkEventDefinedInTransitionsMustBeMappedToEventFactory, checkIsObservable,
  checkStateEntryComponentFnMustReturnComponent, isArrayUpdateOperations, isEntryComponent,
  isEntryComponentFactory
} from './typeChecks';
import { empty, mergeArray, merge, just } from 'most';
import hold from '@most/hold';
// Patch library : https://github.com/Starcounter-Jack/JSON-Patch
// NOTE1 : dont use observe functionality for generating patches
// it uses JSON stringify which makes it impossible to have functions in the
// model object
// NOTE2 : patches are applied IN PLACE
import jsonpatch from '../utils/json-patch';
import {
  EV_GUARD_NONE, ACTION_REQUEST_NONE, AR_GUARD_NONE, ZERO_DRIVER, EVENT_PREFIX, DRIVER_PREFIX,
  INIT_EVENT_NAME, AWAITING_EVENTS, AWAITING_RESPONSE, INIT_STATE,
  CONTRACT_SATISFIED_GUARD_PER_ACTION_RESPONSE, CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE,
  CONTRACT_EVENT_GUARD_FN_RETURN_VALUE, CONTRACT_EVENT_GUARD_CANNOT_FAIL,
  CONTRACT_ACTION_GUARD_CANNOT_FAIL, CONTRACT_ACTION_GUARD_FN_RETURN_VALUE,
  CONTRACT_MODEL_UPDATE_FN_CANNOT_FAIL
} from './properties';

function removeZeroDriver(driverNameArray: any) {
  return filter(function removeZero(driverName) {
    return driverName != ZERO_DRIVER
  }, driverNameArray)
}

function prefixWith(prefix: any) {
  return function _prefixWith(obj: any) {
    return { [prefix]: obj }
  }
}

/**
 * @param {Object.<string, *>} fsmEvent
 * @returns {String}
 */
function getPrefix(fsmEvent: any) {
  return keys(fsmEvent)[0]
}

/**
 * NOTE : fsmEvent MUST only have one key
 * @param fsmEvent
 * @returns {UserEventPrefix|DriverEventPrefix}
 */
function getEventOrigin(fsmEvent: any) {
  return getPrefix(fsmEvent)
}

/**
 * NOTE : fsmEvent MUST only have one key
 * @param prefix
 * @param {UserEvent | DriverEvent} fsmEvent
 * @returns {LabelledUserEvent | LabelledDriverEvent}
 */
function getFsmEventValue(prefix: any, fsmEvent: any) {
  return fsmEvent[prefix]
}

/**
 *
 * @param {String} eventOrDriverName
 * @param {LabelledUserEvent|LabelledDriverEvent} fsmEventValue
 * @returns {EventData | ActionResponse}
 */
function getEventDataOrActionResponse(eventOrDriverName: any, fsmEventValue: any) {
  return fsmEventValue[eventOrDriverName]
}

/**
 *
 * @param fsmEvent
 * @returns {{fsmEventOrigin: (UserEventPrefix|DriverEventPrefix), fsmEventValue:
 *   (LabelledUserEvent|LabelledDriverEvent)}}
 */
function destructureFsmEvent(fsmEvent: any) {
  const prefix = getEventOrigin(fsmEvent);
  const fsmEventValue = getFsmEventValue(prefix, fsmEvent);

  return {
    fsmEventOrigin: prefix,
    fsmEventValue: fsmEventValue
  }
}

// Note that types do not match! TODO : fix that or duplicate functions :-(
/**
 *
 * @param fsmEventValue
 * @returns {{eventOrDriverName: String, eventDataOrActionResponse: (EventData|ActionResponse)}}
 */
function destructureFsmEventValue(fsmEventValue: any) {
  const eventOrDriverName = getPrefix(fsmEventValue);
  const eventDataOrActionResponse = getEventDataOrActionResponse(eventOrDriverName, fsmEventValue);

  return {
    eventOrDriverName: eventOrDriverName,
    eventDataOrActionResponse: eventDataOrActionResponse
  }
}

/**
 *
 * @param {Transitions} transitions
 * @returns {Object.<State, EventName[]>}
 */
function computeStateEventMap(transitions: any) {
  return reduceR(function (/*OUT*/accStateEventMap: any, transName: any) {
    const transOptions = transitions[transName];
    const { origin_state, event } = transOptions;
    accStateEventMap[origin_state] = accStateEventMap[origin_state] || [];
    accStateEventMap[origin_state].push(event);

    return accStateEventMap;
  }, {}, keys(transitions));
}

/**
 *
 * @param {Transitions} transitions
 * @returns {Object.<State, Object.<EventName, TransitionName>>}
 */
function computeStateEventToTransitionNameMap(transitions: any) {
  return reduceR(function (/*OUT*/acc: any, transName: any) {
    const transOptions = transitions[transName];
    const { origin_state, event } = transOptions;
    acc[origin_state] = acc[origin_state] || {};
    acc[origin_state][event] = transName;

    return acc;
  }, {}, keys(transitions));
}

/**
 * Returns the action request corresponding to the first guard satisfied, as
 * defined by the order of the target_states array
 * @param {Transitions} transitions
 * @param {String} transName
 * @param {FSM_Model} model
 * @param {EventData} eventData
 * @return {{ actionRequest : ActionRequest | Null, transitionEvaluation, satisfiedGuardIndex :
 *   Number | Null, reEntry: Boolean, noGuardSatisfied : Boolean}}
 */
function computeTransition(transitions: any, transName: any, model: any, eventData: any) {
  const NOT_FOUND = -1;
  const targetStates = transitions[transName].target_states;

  const satisfiedGuardIndex = findIndex(function (transition: any) {
    /** @type {EventGuard} */
    const eventGuard = transition.event_guard;

    if (eventGuard == EV_GUARD_NONE) {
      return true
    }
    else {
      // EventGuard :: Model -> EventData -> Boolean
      const wrappedEventGuard = tryCatch(eventGuard, handleError(CONTRACT_EVENT_GUARD_CANNOT_FAIL));
      const guardValue = wrappedEventGuard(model, eventData);
      assertContract(isBoolean, [guardValue],
        `computeTransition: ${CONTRACT_EVENT_GUARD_FN_RETURN_VALUE}`);

      return guardValue
    }
  }, targetStates);

  return satisfiedGuardIndex !== NOT_FOUND
    ? {
      satisfiedGuardIndex,
      actionRequest: targetStates[satisfiedGuardIndex].action_request,
      reEntry: targetStates[satisfiedGuardIndex].re_entry,
      transitionEvaluation: targetStates[satisfiedGuardIndex].transition_evaluation,
      noGuardSatisfied: false
    }
    : {
      satisfiedGuardIndex: null,
      actionRequest: null,
      reEntry: null,
      transitionEvaluation: null,
      noGuardSatisfied: true
    }
}

/**
 * Returns the action request corresponding to the first guard satisfied, as
 * defined by the order of the target_states array
 * @param {Transitions} transitions
 * @param {String} transName
 * @param {Number} current_event_guard_index
 * @param model
 * @param {ActionResponse} actionResponse
 * @return {{target_state: null, re_entry: boolean, model_update: null, noGuardSatisfied: boolean}}
 */
function evaluateTransitionWhenActionResponse(transitions: any, transName: any,
                                              current_event_guard_index: any,
                                              model: any, actionResponse: any) {
  /** @type {Transition} */
  const transition = transitions[transName].target_states[current_event_guard_index];
  /** @type {Array} */
  const actionResponseGuards = transition.transition_evaluation;
  const reEntry = transition.re_entry;

  const foundSatisfiedGuard: any = find(function (transEval) {
    const { action_guard }= transEval as any;

    if (action_guard == AR_GUARD_NONE) {
      // if no action guard is configured, it is equivalent to a passing guard
      return true
    }
    else {
      // ActionGuard :: ActionResponse -> Boolean
      const wrappedActionGuard = tryCatch(action_guard, handleError(CONTRACT_ACTION_GUARD_CANNOT_FAIL));
      const guardValue = wrappedActionGuard(model, actionResponse);
      assertContract(isBoolean, [guardValue],
        `computeTransition: ${CONTRACT_ACTION_GUARD_FN_RETURN_VALUE}`);

      return guardValue;
    }
  }, actionResponseGuards);

  return foundSatisfiedGuard
    ? {
      target_state: foundSatisfiedGuard.target_state,
      model_update: foundSatisfiedGuard.model_update,
      re_entry: reEntry
    }
    : { target_state: null, re_entry: null, model_update: null, noGuardSatisfied: true }
}

function isZeroActionRequest(actionRequest: any) {
  return actionRequest == ACTION_REQUEST_NONE || isZeroDriver(actionRequest.driver)
}

function isZeroDriver(driver: any) {
  return driver == ZERO_DRIVER
}

/**
 *
 * @param {FSM_Model} model
 * @param {UpdateOperation[]} modelUpdateOperations
 * @returns {FSM_Model}
 */
function applyUpdateOperations(/*OUT*/model: any, modelUpdateOperations: any) {
  assertContract(isArrayUpdateOperations, [modelUpdateOperations],
    `applyUpdateOperations : ${CONTRACT_MODEL_UPDATE_FN_RETURN_VALUE}`);

  jsonpatch.apply(model, modelUpdateOperations);
  return model;
}

/**
 *
 * @param sources
 * @param settings
 * @param {Event} event$Fn Event factory function
 * @param {EventName} eventName
 * @param {*} _
 * @returns {Observable}
 * @throws
 */
function _labelEvents(sources: any, settings: any, event$Fn: any, eventName: any, _: any) {
  const event$Fn$ = event$Fn(sources, settings);
  assertContract(checkIsObservable, [event$Fn$],
    `event factory function for event ${eventName} must return an observable!`);

  return event$Fn$.map(prefixWith(eventName))
}
const computeAndLabelEvents = curry(_labelEvents);

function getDriverNames(transOptions: any, transName: any) {
  void transName;

  const { target_states } = transOptions;
  /** @type {Array.<String|ZeroDriver>} */
  const driverNames = mapR(function (transition: any) {
    const { action_request } = transition;
    const { driver } : any = action_request || {};

    return driver;
  }, target_states);

  return driverNames;
}

function setFsmStateSinksToNull(fsmState: any) {
  let {
        internal_state, external_state, model, clonedModel,
        current_event_name, current_event_data, current_event_guard_index,
        current_action_request_driver, current_action_request
      } = fsmState;

  return {
    sinks: null,
    internal_state, external_state, model, clonedModel,
    current_event_name, current_event_data, current_event_guard_index,
    current_action_request_driver, current_action_request
  };
}

function performTransitionWhenNoActionRequest(reEntry: any, entryComponents: any, external_state: any, model: any,
                                              clonedModel: any, eventData: any,
                                              transitionEvaluation: any, sources: any, settings: any) {
  // TODO : check contract : when no action requests, only ONE action_guard which MUST be Zero
  const { target_state, model_update } = transitionEvaluation[0];
  const wrappedModelUpdate = tryCatch(model_update,
    handleError(CONTRACT_MODEL_UPDATE_FN_CANNOT_FAIL));
  const modelUpdateOperations = wrappedModelUpdate(clonedModel, eventData, null, settings);
  const entryComponent = entryComponents[target_state];

  let newSinks;

  // Set values for next FSM state update
  const newModel = applyUpdateOperations(model, modelUpdateOperations);
  // NOTE: could also be applyUpdateOperations(clonedModel,...) dont know which
  // is faster
  const newClonedModel = clone(newModel);
  // NOTE : The model to be passed to the entry component is post update
  // NOTE2 : {} because we still want to terminate, i.e. LEAVE previous state. This would be
  // done with the switchMap. Reminder : null means filter i.e. do nothing
  const stateEntryComponent = entryComponent ? entryComponent(newClonedModel) : always({});
  assertContract(either(isNil, checkStateEntryComponentFnMustReturnComponent),
    [stateEntryComponent],
    `state entry component function ${entryComponent.name} 
                    for state ${target_state} MUST return a component or be null`
  );

  if (reEntry && target_state === external_state || target_state !== external_state) {
    // When reentry flag is set, and target state is the origin state, then re-enter that state by
    // re-executing the state entry action
    newSinks = stateEntryComponent(sources, settings);
  }
  else {
    // When no reentry, dont do no action
    newSinks = null;
  }

  return {
    external_state: target_state,
    model: newModel,
    clonedModel: newClonedModel,
    sinks: newSinks,
    internal_state: AWAITING_EVENTS,
    current_event_guard_index: null,
    current_event_name: null,
    current_event_data: null,
    current_action_request_driver: null,
    current_action_request: null
  }
}

function performTransitionWhenActionResponse(fsmState: any, transition: any, fsmCompiled: any, actionResponse: any,
                                             sources: any, settings: any) {
  const { target_state, re_entry, model_update } = transition;
  const { external_state, model, current_event_data } = fsmState;
  const { entryComponents } = fsmCompiled;
  let newSinks;

  const wrappedModelUpdate = tryCatch(model_update,
    handleError(CONTRACT_MODEL_UPDATE_FN_CANNOT_FAIL));
  const modelUpdateOperations = wrappedModelUpdate(model, current_event_data, actionResponse, settings);

  const entryComponentFactory = entryComponents[target_state];
  assertContract(isEntryComponentFactory, [entryComponentFactory],
    `Error while trying to get entry component factory for state ${target_state} : 
            component configured in fsm must be null or a function!`);

  // Set new model's values for next FSM state update
  const newModel = applyUpdateOperations(/*OUT*/model, modelUpdateOperations);
  const newClonedModel = clone(newModel);
  const entryComponent = entryComponentFactory ? entryComponentFactory(newClonedModel) : null;
  assertContract(isEntryComponent, [entryComponent],
    `Error while trying to get entry component for state ${target_state} : 
            configured factory must return null or a component function :: sources -> settings -> Sinks!`);

  if (re_entry && target_state === external_state || target_state !== external_state) {
    // When reentry flag is set, and target state is the origin state, then re-enter that
    // state by re-executing the state entry action
    newSinks = entryComponent ? entryComponent(sources, settings) : {};
  }
  else {
    // we re-enter the same state, but re-entry flag is not set -> dont do nothing
    newSinks = null;
  }

  return {
    internal_state: AWAITING_EVENTS,
    external_state: target_state,
    // Note : The model to be passed to the entry component is post update
    model: newModel,
    clonedModel: newClonedModel,
    sinks: newSinks,
    current_event_guard_index: null,
    current_event_name: null,
    current_event_data: null,
    current_action_request_driver: null,
    current_action_request: null,
  };

}

function processEventWhenAwaitingUserEvents(fsmCompiled: any, sources: any, settings: any, fsmState: any, fsmEvent: any) {
  // If received DriverEvent
  // -- Log warning, Ignore, no state modification, sinks = Null
  // Else If received UserEvent
  // -- If userEvent is NOT among the configured events for the FSM's external state
  // -- -- Log warning, Ignore, no state modification (could also queue??), sinks = Null
  // -- Else If no guards is passed :
  // -- -- no state modification (could also queue??), sinks = Null
  // -- -- Else a guard is passed, get the action request from it :
  // -- -- -- If ActionRequest is Zero
  // -- -- -- -- no need to wait for a response, change the fsm state directly
  // -- -- -- -- check contract : action_guard MUST be Zero
  // -- -- -- -- If re-entry YES && external_state == target_state:
  // -- -- -- -- -- sinks <- execute the component defined as entry for the state transitioned to
  // -- -- -- -- Else
  // -- -- -- -- -- sinks <- null, i.e. do nothing
  // -- -- -- -- internal_state <- AWAITING_EVENTS
  // -- -- -- -- current_event_data <- Null
  // -- -- -- -- current_action_request_driver <- Null
  // -- -- -- -- external_state <- target_state
  // -- -- -- -- model <- apply update operations
  // -- -- -- Else :
  // -- -- -- -- sinks <- Compute action request (MUST be non empty object)
  // -- -- -- -- internal_state <- AWAITING_RESPONSE
  // -- -- -- -- current_event_data <- event_data
  // -- -- -- -- current_action_request_driver <- the ONE key of sinks
  // -- -- -- -- external_state, model <- unmodified
  const { transitions, entryComponents, stateEventsMap, stateEventToTransitionNameMap }
          = fsmCompiled;

  // NOTE : We clone the model to eliminate possible bugs coming from user-defined functions
  // inadvertently modifying the model
  let { external_state, model, clonedModel } = fsmState;
  let newFsmState;

  // NOTE : fsmEvent only has one key by construction
  const { fsmEventOrigin, fsmEventValue } = destructureFsmEvent(fsmEvent);
  const { eventOrDriverName, eventDataOrActionResponse } = destructureFsmEventValue(fsmEventValue);

  switch (fsmEventOrigin) {
    case DRIVER_PREFIX :
      console.warn('Received event from driver while awaiting user events! Ignoring...');
      newFsmState = setFsmStateSinksToNull(fsmState);
      break;

    case EVENT_PREFIX :
      /** @type {EventName[]} */
      const configuredEvents = stateEventsMap[external_state];
      const eventName = eventOrDriverName;
      /** @type {EventData} */
      const eventData = eventDataOrActionResponse;

      if (!configuredEvents || !find(equals(eventName), configuredEvents)) {
        console.warn('Received event for which there is no transition defined!' +
          ' Ignoring...');
        newFsmState = setFsmStateSinksToNull(fsmState);
      }
      else {
        // Compute action request triggered by event, if any
        const transName = stateEventToTransitionNameMap[external_state][eventName];

        /** @type {ActionRequest | Null} */
        const { actionRequest, reEntry, transitionEvaluation, satisfiedGuardIndex, noGuardSatisfied } =
                computeTransition(transitions, transName, clonedModel, eventData);

        if (!!noGuardSatisfied) {
          // no guards is satisfied
          console.warn('Received event for which there is a transition defined but none' +
            ' of the defined guards were satisfied!' +
            ' Ignoring...');
          newFsmState = setFsmStateSinksToNull(fsmState);
        }
        else {
          if (isZeroActionRequest(actionRequest)) {
            newFsmState =
              performTransitionWhenNoActionRequest(reEntry, entryComponents,
                external_state, model, clonedModel, eventData, transitionEvaluation,
                sources, settings);
          }
          else {
            const { request, driver, sink } = computeSinkFromActionRequest(actionRequest, model, eventData);
            // model and external_state are unchanged
            newFsmState = {
              sinks: sink,
              internal_state: AWAITING_RESPONSE,
              current_event_guard_index: satisfiedGuardIndex,
              current_event_name: eventName,
              current_event_data: eventData,
              current_action_request_driver: driver,
              current_action_request: request,
              model, clonedModel, external_state
            }
          }
        }
      }
      break;

    default :
      throw 'evaluateEvent > case AWAITING_EVENTS : unknown fsmEventOrigin!'
  }

  return newFsmState
}

function processEventWhenAwaitingResponseEvent(fsmCompiled: any, sources: any, settings: any, fsmState: any, fsmEvent: any) {
  // If received UserEvent
  // -- Log warning, Ignore, no state modification, sinks = Null
  // Else If received DriverEvent
  // -- If driverEvent is NOT from the expected driver (as to current_action_request_driver)
  // -- -- Log warning, Ignore, no state modification (could also queue??), sinks = Null
  // -- Else If action response fails all action guards :
  // -- -- Log Error, THROW, sinks = Null
  // -- -- Else action response pass the first action guard
  // -- -- -- external_state <- as defined by the transition for the successful action guard
  // -- -- -- sinks <- execute the component defined as entry for the state transitioned to
  // ?? with which sources and settings??
  // -- -- -- update operations <- compute model update
  // -- -- -- model <- apply update operations
  // -- -- -- internal_state <- AWAITING_EVENTS
  // -- -- -- current_event_data <- Null
  // -- -- -- current_action_request_driver <- Null
  // NOTE : We clone the model to eliminate possible bugs coming from user-defined functions
  // inadvertently modifying the model
  const { transitions, stateEventToTransitionNameMap } = fsmCompiled;
  const {
          external_state, model,
          current_event_name, current_event_guard_index,
          current_action_request_driver, current_action_request,
        } = fsmState;
  let newFsmState;

  // NOTE : fsmEvent only has one key by construction
  const { fsmEventOrigin, fsmEventValue } = destructureFsmEvent(fsmEvent);
  const { eventOrDriverName, eventDataOrActionResponse } = destructureFsmEventValue(fsmEventValue);

  switch (fsmEventOrigin) {
    case EVENT_PREFIX :
      console.warn('Received event from user while awaiting driver\'s action response!' +
        ' Ignoring...');
      newFsmState = setFsmStateSinksToNull(fsmState);
      break;

    case DRIVER_PREFIX :
      const driverName = eventOrDriverName;
      const actionResponse = eventDataOrActionResponse;
      const { request } = actionResponse;
      const transName = stateEventToTransitionNameMap[external_state][current_event_name];

      if (driverName !== current_action_request_driver) {
        console.warn(`
              Received driver ${driverName}'s event but not from the expected 
                 ${current_action_request_driver} driver!\n
                 Ignoring...`);
        newFsmState = setFsmStateSinksToNull(fsmState);
      }
      else if (request != current_action_request || !equals(request, current_action_request)) {
        console.warn(`
              Received action response through driver ${driverName} and ignored it as that
                 response does not match the request sent...`);
        newFsmState = setFsmStateSinksToNull(fsmState);
        // TODO : document the fact that driver must return the request in the response
      }
      else {
        const evaluatedTransition: any =
                evaluateTransitionWhenActionResponse(
                  transitions, transName, current_event_guard_index,
                  model, actionResponse
                );

        if (evaluatedTransition.noGuardSatisfied) {
          console.error(`While processing action response from driver ${driverName},
                 executed all configured guards and none were satisfied! 
                  ' Throwing...`);
          newFsmState = setFsmStateSinksToNull(fsmState);
          throw CONTRACT_SATISFIED_GUARD_PER_ACTION_RESPONSE
        }
        else {
          newFsmState = performTransitionWhenActionResponse(
            fsmState, evaluatedTransition, fsmCompiled, actionResponse,
            sources, settings
          );
        }
      }
      break;

    default :
      throw `Received unexpected/unknown ${fsmEventOrigin} event. 
            Can only process driver responses and user events!`
  }

  return newFsmState
}

// TODO: I am here
export function makeFSM(events: any, transitions: any, entryComponents: any, fsmSettings: any) {
  // 0. TODO : check signature deeply - I dont want to check for null all the time

  const fsmSignature = {
    events: isFsmEvents,
    transitions: isFsmTransitions,
    entryComponents: isFsmEntryComponents,
    fsmSettings: isFsmSettings
  };
  const fsmSignatureErrorMessages = {
    events: '',
    transitions: 'Invalid value for transitions parameter : must be non-empty object and must' +
    ' have at least one transition defined which involves the INIT event!',
    entryComponents: 'Invalid value for entryComponents parameter : must be non-empty object!',
    fsmSettings: `Invalid settings : some parameters are mandatory - check documentation!`
  };
  assertContract(checkSignature, [
    { events, transitions, entryComponents, fsmSettings },
    fsmSignature,
    fsmSignatureErrorMessages
  ], '');
  assertContract(checkTargetStatesDefinedInTransitionsMustBeMappedToComponent, arguments,
    'makeFSM : Any target state which is referred to in the transitions parameter must be' +
    ' associated to a component via the entryComponents parameter!');
  assertContract(checkOriginStatesDefinedInTransitionsMustBeMappedToComponent, arguments,
    'makeFSM : Any origin state (except the initial state) which is referred to in the' +
    ' transitions parameter must be associated to a component via the entryComponents parameter!');
  assertContract(checkEventDefinedInTransitionsMustBeMappedToEventFactory, arguments,
    'makeFSM : Any event (except the initial event) which is referred to in the' +
    ' transitions parameter must be associated to a event factory function via the' +
    ' events parameter!');

  const { init_event_data, initial_model, sinkNames } = fsmSettings;

  // 0.1 Pre-process the state machine configuration
  const stateEventsMap = computeStateEventMap(transitions);
  const stateEventToTransitionNameMap = computeStateEventToTransitionNameMap(transitions);

  /**
   *
   * @param {FSM_State} fsmState
   * @param {UserEvent | DriverEvent} fsmEvent
   * @returns {FSM_State}
   * @param events
   * @param transitions
   * @param entryComponents
   * @param sources
   * @param settings
   */
  function _evaluateEvent(events: any, transitions: any, entryComponents: any, sources: any, settings: any,
                          /* OUT */fsmState: any, fsmEvent: any) {
    void events;
    // NOTE : We clone the model to eliminate possible bugs coming from user-defined functions
    // inadvertently modifying the model
    let newFsmState;
    const fsmCompiled = {
      events,
      transitions,
      entryComponents,
      stateEventsMap,
      stateEventToTransitionNameMap
    };
    let { internal_state } = fsmState;

    switch (internal_state) {
      case AWAITING_EVENTS :
        newFsmState = processEventWhenAwaitingUserEvents(fsmCompiled, sources, settings, fsmState, fsmEvent);
        break;

      case AWAITING_RESPONSE :
        newFsmState = processEventWhenAwaitingResponseEvent(fsmCompiled, sources, settings, fsmState, fsmEvent);
        break;

      default :
        const err = 'Unexpected internal state reached by state machine !';
        console.error(err, clone(fsmState));
        throw err;
    }

    return fsmState
  }

  function _computeOutputSinks(sinks$: any, /* OUT */accOutputSinks: any, sinkName: any) {
    accOutputSinks[sinkName] = sinks$
      .map((fsmState: any) => defaultTo(empty(), fsmState.sinks[sinkName]))
      .switch()
      .tap((x: any) =>
        console.warn(`post switch  ${sinkName}`, x));

    return accOutputSinks
  }

  const evaluateEvent = curry(_evaluateEvent);
  const computeOutputSinks = curry(_computeOutputSinks);

  return function fsmComponent(sources: any, settings: any) {
    // 0. TODO : Merge settings somehow (precedence and merge to define) with fsmSettings
    //           init_event_data etc. could for instance be passed there instead of ahead
    // 0.X TODO check remaining contracts
    // for instance : if an action request features a driver name, that driver name MUST be found
    // in the sources

    // 1. Create array of events dealt with by the FSM
    // This will include :
    // - initial event
    // - events from `events` parameter
    // - action responses as found in `transitions`
    /** @type {Array.<Observable.<Object.<EventName, EventData>>>} */
    const eventsArray = values(mapObjIndexed(computeAndLabelEvents(sources, settings), events));

    /** @type {String|ZeroDriver[][]} */
    const driverNameArrays = values(mapObjIndexed(getDriverNames, transitions));

    /** @type {String[]} */
    const driverNameArray = removeZeroDriver(uniq(flatten(driverNameArrays)));
    /** @type {Array.<Observable.<Object.<SinkName, ActionResponse>>>} */
    const actionResponseObsArray = mapR(function getActionResponseObs(driverName: any) {
      return sources[driverName].map(prefixWith(driverName))
    }, driverNameArray);

    /** @type {Object.<EventName, EventData>} */
    const initialEvent = pipe(prefixWith(INIT_EVENT_NAME), prefixWith(EVENT_PREFIX))(init_event_data);

    const fsmEvents = merge(
      mergeArray(eventsArray).map(prefixWith(EVENT_PREFIX)).tap(x => console.warn('user event', x)),
      mergeArray(actionResponseObsArray).map(prefixWith(DRIVER_PREFIX)).tap(
        x => console.warn('response event', x)),
    )
      .startWith(initialEvent);

    // 2. Update the state of the state machine in function of the event
    // State machine state is represented by the following properties :
    // - internal_state : AWAITING_EVENTS | AWAITING_ACTION_RESPONSE
    // - external_state : State
    // - model : *
    // - current_event_data : EventData
    // - current_action_request_driver : DriverName

    /** @type {FSM_State}*/
    const clonedInitialModel = clone(initial_model);
    const initialFSM_State = {
      internal_state: AWAITING_EVENTS,
      external_state: INIT_STATE,
      model: clonedInitialModel,
      clonedModel: clonedInitialModel,
      current_event_name: null,
      current_event_data: null,
      current_event_guard_index: null,
      current_action_request_driver: null,
      current_action_request: null,
      sinks: null
    };

    /** @type {Observable.<FSM_State>}*/
    let eventEvaluation$ = fsmEvents
      .tap(x =>
        console.warn('fsm events', x))
      .scan(
        evaluateEvent(events, transitions, entryComponents, sources, settings),
        initialFSM_State
      )
      // most scan emits the seed as a first value
      .skip(1);

    // 3. Pass output sinks onto the driver
    // Important! `shareReplay` is necessary here because of varying subscription timing
    // occurring inside a `switch` (i.e. subscriptions are delayed)
    /** @type {Observable.<Object.<SinkName, Observable.<*>>>}*/
    let sinks$ = eventEvaluation$
      .filter((fsmState: any) => fsmState.sinks)
      .tap((x: any) => console.warn('sinks', x.sinks))
      .thru(hold);

    /** @type {Object.<SinkName, Observable.<*>>}*/
    let outputSinks = reduceR(computeOutputSinks(sinks$), {}, sinkNames);

    return outputSinks
  };
}

function computeSinkFromActionRequest(actionRequest: any, model: any, eventData: any) {
  const request = actionRequest.request(model, eventData);
  const driver = actionRequest.driver;

  return {
    request: request,
    driver: driver,
    sink: { [driver]: just(request) }
  }
}
