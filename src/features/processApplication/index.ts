// NOTE
// dump staging
// https://sparks-staging-v3.firebaseio.com/.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// dump Opps reference
// https://sparks-staging-v3.firebaseio.com/Opps.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// auth token here is in settings, service account, database secret
import { Stream, never, just, combineArray } from 'most';
import { div } from '@motorcycle/dom';
import { MainSinks, MainSources } from '../../app';
import {
  map, filter, all, flip, keys, pipe, always, mapObjIndexed, values, curry, zipObj, identity, pick,
  flatten, T
} from 'ramda';
import {
  EV_GUARD_NONE, ACTION_REQUEST_NONE, ACTION_GUARD_NONE, INIT_EVENT_NAME, INIT_STATE
} from '../../components/properties';
import { OPPORTUNITY, USER_APPLICATION, TEAMS, UPDATE } from '../../domain';
import { makeFSM } from '../../components/FSM';
import { modelUpdateIdentity, toJsonPatch } from '../../utils/FSM';
import { Opportunity, Teams, Team, Project } from '../../types/domain';
import { FirebaseUserChange } from '../../drivers/firebase-user';
import {
  UserApplication, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW, Step, ApplicationTeamInfo,
  TeamsInfo, ApplicationQuestionInfo, Progress, ApplicationAboutInfo, UserApplicationModel,
  AboutStateRecord
} from '../../types/processApplication';
import {
  aboutComponent, getAboutEvents, getAboutIntents, getAboutState, getAboutFormData,
  aboutScreenFieldValidationSpecs
} from './aboutComponent';
import { Transitions, FSM_Model, EventData } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';

const aboutYouFields = ['superPower'];
const personalFields = ['birthday', 'phone', 'preferredName', 'zipCode', 'legalName'];

const INIT_S = 'INIT';
const STATE_ABOUT = 'About';
const STATE_QUESTION = 'Question';
const STATE_TEAMS = 'Teams';
const STATE_REVIEW = 'Review';

const FETCH_EV = 'fetch';
const ABOUT_CONTINUE = 'about_continue';

const sinkNames = ['dom', 'domainAction$'];

function initializeModel(model: any, eventData: any, actionResponse: any) {
  void actionResponse, model;

  let initialModel: UserApplicationModel;
  const userApplication: UserApplication | null = eventData.userApplication;
  const { userKey, opportunity, teams, opportunityKey } = eventData;
  // user :: FirebaseUserChange = firebase.User | null;
  // opportunity here is the Opportunity whose key is somehow encoded in the URL
  // teams is all the teams in the database (!)

  if (!userApplication) {
    // we want to keep only the teams for the opportunity
    // For that, we get the project key in the opportunity
    // and keep only the team with that project key
    const { projectKey } = opportunity as Opportunity;

    // go through the teams, for each key, keep only those whose value satisfy a predicate
    const filteredTeamKeys = filter(teamKey => (teams[teamKey] as Team).projectKey === projectKey,
      keys(teams as Teams));
    const teamsInfo: TeamsInfo = zipObj(filteredTeamKeys, map(always({
      answer: '',
      alreadyVisited: false
    } as ApplicationTeamInfo), filteredTeamKeys));

    initialModel = {
      opportunity: opportunity,
      teams: teams,
      errorMessage: null,
      userApplication: {
        userKey: userKey,
        opportunityKey: opportunityKey,
        about: {
          aboutYou: { superPower: '' },
          personal: { phone: '', preferredName: '', zipCode: '', legalName: '', birthday: '' }
        } as ApplicationAboutInfo,
        questions: { answer: '' } as ApplicationQuestionInfo,
        teams: teamsInfo,
        progress: {
          step: STEP_ABOUT,
          hasApplied: false,
          latestTeam: ''
        } as Progress
      }
    }
  }
  else {
    // Note: we reference the user application in the model, we should make sure that the user
    // application is immutable, otherwise it will spill in the model
    initialModel = { opportunity, teams, userApplication, errorMessage: null }
  }

  return toJsonPatch('')(initialModel);
}

function _isStepX(targetStep: Step, model: any, eventData: any) {
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
const isStep = curry(_isStepX);

function fetchUserApplicationData(sources: any, settings: any) {
  const { user$ } = sources;
  const { model : { userApplication : { opportunityKey, userKey } } } = settings;
  const userApp$ = sources.query$.query(USER_APPLICATION, { opportunityKey, userKey })
    .tap(console.warn.bind(console, 'USER_APPLICATION fetch event'));
  const teams$ = sources.query$.query(TEAMS, {})
    .tap(console.warn.bind(console, 'TEAMS fetch event'));
  const opportunities$: Stream<Opportunity> = sources.query$.query(OPPORTUNITY, { opportunityKey })
    .tap(console.warn.bind(console, 'OPPORTUNITY fetch event'));

  // TODO : add typescript types for { user, opportunity, userApplication, teams }
  // NOTE : combineArray will produce its first value when all its dependent streams have
  // produced their first value. Hence this is equivalent to a zip for the first value, which
  // is the only one we need anyways (there is no zipArray in most)
  return combineArray<FirebaseUserChange, Opportunity, UserApplication, Teams, any>(
    (user, opportunity, userApplication, teams) =>
      ({
        user,
        opportunity,
        userApplication,
        teams,
        userKey: settings.userKey,
        opportunityKey: settings.opportunityKey
      }),
    [user$, opportunities$, userApp$, teams$]
  )
    .tap(console.warn.bind(console, 'combined user, userapp, teams fetch event'))
    .take(1)
}

function makeRequestToUpdateUserApplication(model: UserApplicationModel, eventData: AboutStateRecord) {
  console.log('action_request : eventData :AboutStateRecord', eventData);

  // Build user application :
  // - from the about fields (event data)
  // - from the past information stored in the current value of model
  // NOTE : userApplication should always exist, it is created by FETCH_EV event
  const userApplication: UserApplication = {
    userKey: model.userApplication.userKey,
    opportunityKey: model.userApplication.opportunityKey,
    about: {
      aboutYou: {
        superPower: eventData.superPower
      },
      personal: {
        birthday: eventData.birthday,
        phone: eventData.phone,
        preferredName: eventData.preferredName,
        zipCode: eventData.zipCode,
        legalName: eventData.legalName
      }
    },
    questions: model.userApplication.questions,
    teams: model.userApplication.teams,
    progress: model.userApplication.progress
  };

  return {
    context: USER_APPLICATION,
    command: UPDATE,
    payload: userApplication
  }
}

function updateModelWithAboutDataAndError(model: FSM_Model, eventData: EventData,
                                          actionResponse: DomainActionResponse) {
  const { err } = actionResponse;
  // By construction err cannot be null, but typescript will force to consider that case

  return flatten([
    updateModelWithAboutData(model, eventData, actionResponse),
    {
      op: 'add',
      path: '/errorMessage',
      value: err ? err.toString() : 'internal error! there should be an error message'
    }
  ])
}

function updateModelWithAboutData(model: FSM_Model, eventData: EventData,
                                  actionResponse: DomainActionResponse) {
  void actionResponse, model;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, eventData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, eventData)),
    toJsonPatch('/errorMessage')(null),
  ])
}

// TODO : also beware that the responses wont be caught as they come with .getResponse...
// find a workaround
// TODO : also investiate I don't need a token if I keep the request, comparison with == should
// suffice
// TODO : think about what happen when in state team detail, not handled for now... extra arrow
// in graph? I guess so, and use lastTeam as info

const events = {
  [FETCH_EV]: fetchUserApplicationData,
  [ABOUT_CONTINUE]: (sources: any, settings: any) => {
    const events = getAboutEvents(sources, settings);
    const intents = getAboutIntents(sources, settings, events);
    const state = getAboutState(sources, settings, events);

    return getAboutFormData(state, intents)
    // basically let pass iff all fields passed validation
      .filter(pipe(
        mapObjIndexed((value, key) => aboutScreenFieldValidationSpecs[key](value))),
        values,
        all(identity)
      ) as Stream <AboutStateRecord>
  }
};

const transitions: Transitions = {
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
        event_guard: isStep(STEP_ABOUT),
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
        event_guard: isStep(STEP_QUESTION),
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
        event_guard: isStep(STEP_TEAMS),
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
        event_guard: isStep(STEP_REVIEW),
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
  },
  toQuestionScreen: {
    origin_state: STATE_ABOUT,
    event: ABOUT_CONTINUE,
    target_states: [
      {
        event_guard: EV_GUARD_NONE,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: [
          {
            action_guard: (model: FSM_Model, actionResponse: DomainActionResponse) => {
              void model;
              const { err } = actionResponse;
              return !err;
            },
            target_state: STATE_QUESTION,
            // keep model in sync with repository
            model_update: updateModelWithAboutData
          },
          // If there is an error updating the model, keep in the same state
          // It is important to update the model locally even if the update could not go in the
          // remote repository, so that when the view is shown the already entered
          // values are shown
          // TODO : same would be nice while saving to remote to show some message `pending...`
          {
            action_guard: T,
            target_state: STATE_ABOUT,
            model_update: updateModelWithAboutDataAndError
          }
        ]
      },
    ]
  }
};

const entryComponents = {
  [INIT_S]: function showInitView(model: UserApplicationModel) {
    void model;

    // This is a transient state - display some loading indicator
    return function initComponent(sources: any, settings: any) {
      void sources, settings;

      return {
        dom: just(div('Loading user application data...'))
      }
    }
  },
  [STATE_ABOUT]: function showViewStateAbout(model: UserApplicationModel) {
    return flip(aboutComponent)({ model })
  },
  // TODO : replace aboutComponent by questionComponent
  [STATE_QUESTION]: function (model: UserApplicationModel) {
    return flip(aboutComponent)({ model })
  },
  // TODO : same here
  [STATE_TEAMS]: function (model: UserApplicationModel) {
    return flip(aboutComponent)({ model })
  },
  // TODO : same here
  [STATE_REVIEW]: function (model: UserApplicationModel) {
    return flip(aboutComponent)({ model })
  },
};

const fsmSettings = {
  initial_model: {},
  init_event_data: {},
  sinkNames: sinkNames
};


const fsmComponent = makeFSM(events, transitions, entryComponents, fsmSettings);

function getEmptyProject(): Project {
  return {
    name: '',
    description: '',
    ownerProfileKey: ''
  }
}

function getEmptyUserApplicationModel(): UserApplicationModel {
  return {
    opportunity: {
      description: '',
      authorProfilekey: '',
      isPublic: true,
      name: '',
      project: getEmptyProject(),
      projectKey: '',
      question: '',
      confirmationsOn: false
    },
    teams: {},
    userApplication: {
      opportunityKey: '', userKey: '',
      about: {
        aboutYou: { superPower: '' },
        personal: { legalName: '', preferredName: '', phone: '', zipCode: '', birthday: '' }
      },
      questions: { answer: '' },
      progress: { step: '', hasApplied: false, latestTeam: '' },
      teams: {}
    },
    errorMessage: null
  }
}

// Note : in the case of a rounting, ProcessApplication will be called with the keys in setting
export function ProcessApplication(sources: MainSources): MainSinks {
  const emptyUserApplicationModel = getEmptyUserApplicationModel();
  emptyUserApplicationModel.userApplication.opportunityKey = '-KEMfQuSuMoabBEy9Sdb';
  emptyUserApplicationModel.userApplication.userKey = 'facebook:10209589368915969';

  const sinks = fsmComponent(sources, { model: emptyUserApplicationModel });
  console.warn('ProcessApplication', sinks);

// TODO
  return {
    dom: sinks.dom,
    router: sinks.router || never(),
    authentication$: sinks.authentication$ || never(),
    domainAction$: sinks.domainAction$ || never()
  };
}

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
 *   + TeamsInfo :: Hashmap (TeamName, ApplicationTeamInfo)
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
