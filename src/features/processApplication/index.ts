import { never, just } from 'most';
import hold from '@most/hold';
import { h2, div } from '@motorcycle/dom';
import { MainSinks, MainSources } from '../../app';
import { flip, type, keys, pipe, prop, equals, always } from 'ramda';
import {
  EV_GUARD_NONE,
  ACTION_REQUEST_NONE,
  ACTION_GUARD_NONE,
  INIT_EVENT_NAME,
  INIT_STATE
} from '../../components/properties';
import { OPPORTUNITY, ADD } from '../../domain';
import { makeFSM } from '../../components/FSM';
import { DomainAction } from '../../types/repository';

const initialModel = {
  dummyKey1InitModel: 'dummyValue1',
  dummyKey2InitModel: 'dummyValue2',
  opportunity: 'Activator Prime'
};
const opsOnInitialModel = [
  { op: "add", path: '/dummyKey3InitModel', value: 'dummyValue3' },
  { op: "replace", path: '/dummyKey1InitModel', value: 'dummyValue2' },
  { op: "remove", path: '/dummyKey2InitModel' },
];
const initEventData = {
  dummyKeyEvInit: 'dummyValue'
};
const sinkNames = ['dom', 'domainAction$'];

function dummyComponent1Sink(sources: any, settings: any) {
  const { model } = settings;
  const { query$ } = sources;
  void model, query$;

  return {
    dom: sources.domainAction$
      .getResponse(OPPORTUNITY)
      .filter(pipe(prop('token'), equals(1)))
      .map(always('response received'))
      .map(view),
    domainAction$: just({
      context: OPPORTUNITY,
      command: ADD,
      params: {
        opportunity: 'New Opportunity',
        data: 'some name',
        token: 1
      }
    } as DomainAction)
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
  console.warn('ProcessApplication', sinks);

// TODO
  return {
    dom: sinks.dom,
    router: sinks.router || never(),
    authentication$: sinks.authentication$ || never(),
    domainAction$ : sinks.domainAction$.thru(hold) || never()
  };
}

// TODO
function view(obj: any) {
  console.log('obj', obj);
  return type(obj) === 'String'
    ? div([
    h2(`Received: ${obj}`),
  ])
    : div(keys(obj));
}
void view;

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
