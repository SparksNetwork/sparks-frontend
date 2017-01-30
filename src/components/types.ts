/**
 * @typedef {String} EventName
 */
import { HashMap } from '../types/repository';

export type EventName = string;

/**
 * @typedef {SinkName} DriverName
 */
export type SinkName = string;
export type DriverName = SinkName;

/**
 * @typedef {*} EventData
 */
export type EventData = any;

/**
 * @typedef {String} State
 */
export type State = string;

/**
 * @typedef {String} JSON_Pointer
 * albeit a string with a particular format
 * cf. https://tools.ietf.org/html/rfc6901
 * The ABNF syntax of a JSON Pointer is:
 *  json-pointer    = *( "/" reference-token )
 *  reference-token = *( unescaped / escaped )
 *  unescaped       = %x00-2E / %x30-7D / %x7F-10FFFF ; %x2F ('/') and %x7E ('~') are excluded from
 *   'unescaped' escaped         = "~" ( "0" / "1" ) ; representing '~' and '/', respectively
 */
/**
 * @typedef {String} TransitionName
 */
export type TransitionName = string;

/**
 * @typedef {Object.<EventName, Event>} Events
 */
export type Events = HashMap<Event>;

/**
 * @typedef {function(Sources):EventData} Event
 */
// TODO : specify sources better
export interface Event {
  (sources : any) : EventData;
}

/**
 * @typedef {*} FSM_Model
 */
export type FSM_Model = any;

/**
 * @typedef {*} Command
 */
export type Command = any;

/**
 * @typedef {*} Payload
 */
export type Payload = any;

/**
 * @typedef {*} ActionResponse
 */
export type ActionResponse= any;

/**
 * @typedef {String} ZeroDriver
 */
// TODO : check if still up to date

/**
 * @typedef {{command : Command, payload : Payload}} Request
 */
export type Context = any;
// TODO : change to any to allow overloading?? That type is not used by the FSM, only by the driver
export interface Request {
  context : Context,
  command : Command;
  payload : Payload;
}

/**
 * @typedef {function(FSM_Model, EventData):Request} RequestFn
 */
export interface RequestFn {
  (model : FSM_Model, eventData : EventData) : Request;
}

/**
 * @typedef {{driver : SinkName|ZeroDriver, request : RequestFn, }} ActionRequest
 */
export interface ActionRequest {
  driver : SinkName | null,
  request : RequestFn
}

/**
 * @typedef {function(FSM_Model, EventData) : Boolean} EventGuard
 */
export interface EventGuard {
  (model : FSM_Model, eventData : EventData) : boolean;
}

/**
 * @typedef {function(ActionResponse) : Boolean} ActionGuard
 */
export interface ActionGuard {
  (model: FSM_Model, actionResponse : ActionResponse) : boolean;
}

/**
 * @typedef {function(FSM_Model, EventData, ActionResponse) : UpdateOperation[]} UpdateFn
 */
export interface UpdateFn {
  (model : FSM_Model, eventData : EventData, actionResponse : ActionResponse): Array<UpdateOperation>
}

/**
 * @typedef {{action_guard : ActionGuard, target_state : State, model_update : UpdateFn}} TransEval
 */
type ActionGuardNone = null;
export interface TransEval {
  action_guard : ActionGuard | ActionGuardNone;
  target_state : State;
  model_update : UpdateFn;
}

/**
 * @typedef {{event_guard : EventGuard, action_request : ActionRequest, transition_evaluation :
 *   TransEval[]}} Transition
 */
type EventGuardNone = null;
export interface Transition {
  event_guard : EventGuard | EventGuardNone;
  action_request : ActionRequest | null;
  transition_evaluation : Array<TransEval>;
}

/**
 * @typedef {{origin_state : State, event : EventName, target_states : Transition[]}}
 *   TransitionOptions
 */
export interface TransitionOptions {
  origin_state : State;
  event : EventName;
  target_states : Array<Transition>;
}

/**
 * @typedef {Object.<TransitionName, TransitionOptions>} Transitions
 */
export type Transitions = HashMap<TransitionOptions>


export type JSON_Pointer = string;

/**
 * @typedef {{op : "add", path : JSON_Pointer, value : *}} Op_Add
 */
export interface Op_Add {
  op : 'add';
  path : JSON_Pointer;
  value : any;
}

/**
 * @typedef {{op : "replace", path : JSON_Pointer, value : *}} Op_Replace
 */
export interface Op_Replace {
  op : 'replace';
  path : JSON_Pointer;
  value : any;
}

/**
 * @typedef {{op : "remove", path : JSON_Pointer}} Op_Remove
 */
export interface Op_Remove {
  op : 'remove';
  path : JSON_Pointer;
}

/**
 * @typedef {{op : "move", from : JSON_Pointer, path : JSON_Pointer}} Op_Move
 */
export interface Op_Move {
  op : 'move';
  from : JSON_Pointer,
  path : JSON_Pointer;
}

/**
 * @typedef {{op : "copy", from : JSON_Pointer, path : JSON_Pointer}} Op_Copy
 */
export interface Op_Copy {
  op : 'copy';
  from : JSON_Pointer,
  path : JSON_Pointer;
}

/**
 * @typedef {{op : "test", path : JSON_Pointer, value : *}} Op_Test
 */
export interface Op_Test {
  op : 'test';
  path : JSON_Pointer;
  value : any;
}

/**
 * @typedef {Op_Add|Op_Remove|Op_Replace|Op_Move|Op_Copy|Op_Test} JSON_Patch
 */
export type JSON_Patch = Op_Add|Op_Remove|Op_Replace|Op_Move|Op_Copy|Op_Test;

/**
 * @typedef {JSON_Patch} UpdateOperation
 */
export type UpdateOperation = JSON_Patch;

/**
 * @typedef {String} AWAITING_EVENTS
 */
/**
 * @typedef {String} AWAITING_ACTION_RESPONSE
 */
/**
 * @typedef {AWAITING_EVENTS|AWAITING_ACTION_RESPONSE} InternalState
 */
/**
 * @typedef {{internal_state : InternalState, external_state : State, model : FSM_Model,
 *   current_event_name : EventName | Null, current_event_data : EventData | Null,
 *   current_event_guard_index : Number | Null, current_action_request_driver : DriverName | Null,
 *   sinks : Sinks | Null}} FSM_State
 */
/**
 * @typedef {String} UserEventPrefix
 */
export type UserEventPrefix = string;

/**
 * @typedef {String} DriverEventPrefix
 */
export type DriverEventPrefix = string;

/**
 * @typedef {Object.<EventName, EventData>} LabelledUserEvent
 */
export type LabelledUserEvent = HashMap<EventData>;

/**
 * @typedef {Object.<DriverName, ActionResponse>} LabelledDriverEvent
 */
export type LabelledDriverEvent = HashMap<ActionResponse>;

/**
 * @typedef {Object.<UserEventPrefix, LabelledUserEvent>} UserEvent
 */
export type UserEvent = HashMap<LabelledUserEvent>;

/**
 * @typedef {Object.<DriverEventPrefix, LabelledDriverEvent>} DriverEvent
 */
export type DriverEvent = HashMap<LabelledDriverEvent>;
