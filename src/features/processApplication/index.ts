// NOTE
// dump staging
// https://sparks-staging-v3.firebaseio.com/.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// dump Opps reference
// https://sparks-staging-v3.firebaseio.com/Opps.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// auth token here is in settings, service account, database secret
import { never, just, combineArray } from 'most';
// TODO : add to package json
// import { sampleArray } from '@most/sample';
import { h2, div } from '@motorcycle/dom';
import { MainSinks, MainSources } from '../../app';
import { flip, type, keys, pipe, path, equals, always, mapObjIndexed, values , curry} from 'ramda';
import {
  EV_GUARD_NONE,
  ACTION_REQUEST_NONE,
  ACTION_GUARD_NONE,
  INIT_EVENT_NAME,
  INIT_STATE
} from '../../components/properties';
import { OPPORTUNITY, ADD, USER_APPLICATION, TEAMS } from '../../domain';
import { makeFSM } from '../../components/FSM';
import { modelUpdateIdentity } from '../../utils/FSM';
import { DomainAction } from '../../types/repository';
import { UserApplication, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW, Step } from '../../types/processApplication';

const initialModel = {
  dummyKey1InitModel: 'dummyValue1',
  dummyKey2InitModel: 'dummyValue2',
  opportunity: 'Activator Prime'
};
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
      .tap(console.warn.bind(console, 'actionResponse'))
      .filter(pipe(path('request.params.token'.split('.')), equals(1)))
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

function initializeModel (model:any, eventData:any, actionResponse:any){
  void actionResponse, model;

  const userApplication : UserApplication = eventData.userApplication;

  // basically the model should mirror the user application
  // Note: we copy the user application in the model, we should make sure that the user
  // application is immutable, otherwise it will spill in the model
  // TODO : maybe clone it here instead?
  return pipe(mapObjIndexed((key, value) => {
    return {
      op: "add",
      path: ['', key].join('/'),
      value: value
    }
  }), values)(userApplication)
}

function _isStepX(targetStep:Step, model: any, eventData: any){
  void model;
  // event data here is the result of the query on user application
  // it is null if there is no existing user application
  // If it is null, it means we are starting a new user application
  // in which case we start in step About
  // if there is an existing user application, then we retrieve the
  // current step from there
  const userApplication = eventData.userApplication as UserApplication;

  if (userApplication && userApplication.progress) {
    const { step, hasApplied } = userApplication.progress;
    if (hasApplied) {
      // if the user already applied, it is implicitly in the review state
      return targetStep === STEP_REVIEW;
    }
    else {
      return step === targetStep
    }
  }
  else {
    // if there is no prior user application, first step must be About
    return targetStep === STEP_ABOUT
  }
}
const isStepX = curry(_isStepX);

const INIT_S = 'INIT';
const STATE_ABOUT = 'About';
const STATE_QUESTION = 'Question';
const STATE_TEAMS = 'Teams';
const STATE_REVIEW = 'Review';

const FETCH_EV = 'fetch';

const events = {
  [FETCH_EV]: (sources: any, settings: any) => {
    const { user$ } = sources;
    const userApp$ = sources.query$.query(USER_APPLICATION, {
      opportunity: settings.opportunity,
      user: settings.user
    })
      .tap(console.warn.bind(console, 'USER_APPLICATION fetch event'));
    const teams$ = sources.query$.query(TEAMS, {})
      .tap(console.warn.bind(console, 'TEAMS fetch event'));
    const opportunities$ = sources.query$.query(OPPORTUNITY, {
      opportunity: settings.opportunity,
    })
      .tap(console.warn.bind(console, 'OPPORTUNITY fetch event'));

    // NOTE : combineArray will produce its first value when all its dependent streams have
    // produced their first value. Hence this is equivalent to a zip for the first value, which
    // is the only one we need anyways (there is no zipArray in most)
    return combineArray(
      (user: any, opportunity: any, userApplication: any, teams: any) =>
        ({ user, opportunity, userApplication, teams }),
      [user$, opportunities$, userApp$, teams$]
    )
      .tap(console.warn.bind(console, 'combined user, userapp, teams fetch event'))
      .take(1)
  }
};

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
            target_state: INIT_S,
            model_update: modelUpdateIdentity
          }
        ]
      }
    ]
  },
  dispatch: {
    origin_state: INIT_S,
    event: FETCH_EV,
    target_states: [
      {
        event_guard: isStepX(STEP_ABOUT),
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: STATE_ABOUT,
            model_update: initializeModel // with event data which is read from repository
          }
        ]
      },
      {
        event_guard: isStepX(STEP_QUESTION),
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: STATE_QUESTION,
            model_update: initializeModel // with event data which is read from repository
          }
        ]
      },
      {
        event_guard: isStepX(STEP_TEAMS),
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: STATE_TEAMS,
            model_update: initializeModel // with event data which is read from repository
          }
        ]
      },
      {
        event_guard: isStepX(STEP_REVIEW),
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: STATE_REVIEW,
            model_update: initializeModel // with event data which is read from repository
          }
        ]
      }
    ]
  }
};

const entryComponents = {
  INIT: function (model: any) {
    void model;

    // This is a transient state - display some loading indicator
    return {
      dom: just(div('Loading user application data...'))
    }
  },
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
  const sinks = fsmComponent(sources, { opportunity: 'Activator Prime', user: 'Bob Dobbs' });
  console.warn('ProcessApplication', sinks);

// TODO
  return {
    dom: sinks.dom,
    router: sinks.router || never(),
    authentication$: sinks.authentication$ || never(),
    domainAction$: sinks.domainAction$ || never()
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

// TODO : in User application domain, object is userapps:{users:{key:{opps:{key:{::UserApplication}
//   so from the url get user key and opp key, and from that get the user application
// WRITE : I will be writing to that
// Read : same
// !! how to get the team info from Opps and user key

// basically get the project key from the opps and then all the teams and filter by project key
// UserApplication = f(User, Opps, Teams) = Model
// So event data init will be {User, Opps, Teams} then update model will the makeup
// for UserApplication init, which will also be model init

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
 *        user :: =<User.key> i.e. String,
 *        opportunity :: =<Opportunity.key> i.e. String,
 *        about::ApplicationAboutInfo,
 *        questions: ApplicationQuestionInfo,
 *        teams: TeamInfo,
 *        progress: Progress
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
 *   + Progress :: Record (step:: Step, Applied: Boolean, latestTeam: TeamID)
 *     + Step :: Enum (About, Question, Teams, Review)
 */
