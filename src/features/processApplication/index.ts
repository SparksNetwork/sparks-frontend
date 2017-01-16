// import { never, combine } from 'most';
import { never, just, merge as mergeM } from 'most';
// import { h2, a, div, p } from '@motorcycle/dom';
import { h2, div } from '@motorcycle/dom';
import { MainSinks, MainSources } from '../../app';
import { flip, type, keys } from 'ramda';
import {
  EV_GUARD_NONE,
  ACTION_REQUEST_NONE,
  ACTION_GUARD_NONE,
  INIT_EVENT_NAME,
  INIT_STATE,
  DRIVER_PREFIX
} from '../../components/properties';
import { makeFSM } from '../../components/FSM';


const initialModel = {
  dummyKey1InitModel: dummyValue1,
  dummyKey2InitModel: dummyValue2,
};
const opsOnInitialModel = [
  { op: "add", path: '/dummyKey3InitModel', value: dummyValue3 },
  { op: "replace", path: '/dummyKey1InitModel', value: dummyValue2 },
  { op: "remove", path: '/dummyKey2InitModel' },
];
const initEventData = {
  dummyKeyEvInit: dummyValue
};
const sinkNames = ['sinkA', 'sinkB', 'sinkC', 'modelSink', dummyDriver];

function dummyComponent1Sink(sources: any, settings: any) {
  void sources;
  const { model } = settings;

  return {
    sinkA: just(`test init`),
    modelSink: just(model)
  }
}

function modelUpdateInitTransition(model: any, eventData: any, actionResponse: any) {
  console.log('model, eventData, actionresponse', model, eventData, actionResponse);

  return opsOnInitialModel
}

const events = {};

const transitions = {
  T_INIT: {
    origin_state: INIT_STATE,
    event: INIT_EVENT_NAME,
    target_states: [
      {
        event_guard: EV_GUARD_NONE,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: 'First',
            model_update: modelUpdateInitTransition
          }
        ]
      }
    ]
  }
};

const entryComponents = {
  First: function (model: any) {
    return flip(dummyComponent1Sink)({ model })
  }
};

const fsmSettings = {
  initial_model: initialModel,
  init_event_data: initEventData,
  sinkNames: sinkNames
};

const fsmComponent = makeFSM(events, transitions, entryComponents, fsmSettings);

export function ProcessApplication(sources: MainSources): MainSinks {
  const sinks = fsmComponent(sources, {});

// TODO
  return {
    dom: sinks.dom,
    router: sinks.router,
    authentication$: sinks.authentication$,
  };
}

// TODO
function view(obj: any) {
  console.log('obj',obj);
  return type(obj) === 'String'
    ? div([
    h2(`Received: ${obj}`),
  ])
    : div (keys(obj));
}


/**
 * TODO : check legacy firebase and queue driver
 * TODO : move to domain object API?
 * TODO : sources:
 * - user$
 *   - from firebase.User, got from log in
 * - opportunity$ : Stream<Opportunity>
 *   + Opportunity :: Record (teams, ...whatever info which is specific to an opportunity)
 *   + teams :: [TeamInfo]
 *     + TeamInfo :: Record (name, description, profilePic, teamLeadQuestion, teamLeadRole)
 *   + name :: String
 *   + profilePic :: PictureLink
 *   + organizerQuestion :: String
 *   + organizerRole :: String
 * - userApplication$ : Stream<UserApplication>
 *   +  UserApplication :: Record (
 *        opportunity :: =<Opportunity.name> i.e. String,
 *        about::ApplicationAboutInfo,
 *        questions: ApplicationQuestionInfo,
 *        teams: TeamInfo
 *      )
 *   + TeamInfo :: Hashmap (TeamName, ApplicationTeamInfo)
 *     + ApplicationTeamInfo :: Record (answer :: string, alreadyVisited :: boolean)
 *   + ApplicationAboutInfo :: Record (
 *       aboutYou:: ApplicationAboutYouInfo, Personal:: ApplicationPersonalInfo
 *     )
 *     + ApplicationAboutYouInfo :: Record (superPower :: String)
 *     + ApplicationPersonalInfo :: Record (
 *         legalName :: String
 *         preferredName :: String
 *         phone :: PhoneInfo,
 *         birthday :: DatePickerInfo
 *         zipCode :: ZipCode
 *       )
 *   + ApplicationQuestionInfo :: Record (answer:: string)
 */
