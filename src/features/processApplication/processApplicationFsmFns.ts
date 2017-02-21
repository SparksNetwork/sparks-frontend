import { Stream, combineArray } from 'most';
import {
  any, merge, pipe, values, all, map, filter, keys, always, curry, zipObj, pick, flatten
} from 'ramda';
import { OPPORTUNITY, USER_APPLICATION, TEAMS, UPDATE } from '../../domain';
import { toJsonPatch, addOpToJsonPatch } from '../../utils/FSM';
import { Opportunity, Teams, Team } from '../../types/domain';
import { FirebaseUserChange } from '../../drivers/firebase-user';
import {
  UserApplication, STEP_ABOUT, STEP_REVIEW, Step, ApplicationTeamInfo, TeamsInfo,
  ApplicationQuestionInfo, Progress, ApplicationAboutInfo, UserApplicationModel, aboutYouFields,
  personalFields, STEP_QUESTION, STEP_TEAMS, questionFields, UserApplicationModelNotNull
} from '../../types/processApplication';
import { FSM_Model, EventData } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';
import { isBoolean, preventDefault } from '../../utils/utils';
import {
  validateScreenFields, aboutScreenFieldValidationSpecs,
  questionScreenFieldValidationSpecs
} from './processApplicationValidation';
import { getAboutFormData, getQuestionFormData } from './processApplicationFetch';

export function initializeModel(model: any, eventData: UserApplicationModel, actionResponse: any, settings: any) {
  void actionResponse, model;

  let initialModel: UserApplicationModel;
  const { userKey, opportunityKey } = settings;
  const { user, opportunity, teams, userApplication } = eventData;
  // userKey and opportunityKey are in settigns but we dont have settings here
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
      alreadyFilledIn: false
    } as ApplicationTeamInfo), filteredTeamKeys));

    initialModel = {
      user: user,
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
          latestTeamIndex: ''
        } as Progress
      },
      validationMessages: {}
    }
  }
  else {
    // Note: we reference the user application in the model, we should make sure that the user
    // application is immutable, otherwise it will spill in the model
    // TODO : check validity of userApp coming from repository or not??
    initialModel = {
      user,
      opportunity,
      teams,
      userApplication,
      errorMessage: null,
      validationMessages: {}
    }
  }

  return toJsonPatch('')(initialModel);
}

export function fetchUserApplicationModelData(sources: any, settings: any) {
  const { user$ } = sources;
  const { opportunityKey, userKey } = settings;
  const userApp$ = fetchUserApplicationData(sources, opportunityKey, userKey);
  const teams$ = sources.query$.query(TEAMS, {});
  const opportunities$: Stream<Opportunity> = sources.query$.query(OPPORTUNITY, { opportunityKey });

  // NOTE : combineArray will produce its first value when all its dependent streams have
  // produced their first value. Hence this is equivalent to a zip for the first value, which
  // is the only one we need anyways (there is no zipArray in most)
  return combineArray<FirebaseUserChange, Opportunity | null, UserApplication | null, Teams | null, any>(
    (user, opportunity, userApplication, teams) =>
      ({
        user,
        opportunity,
        userApplication,
        teams,
        errorMessage: null,
        validationMessages: {}
      }),
    [user$, opportunities$, userApp$, teams$]
  )
    .tap(console.warn.bind(console, 'combined user, userapp, teams fetch event'))
    .take(1)
}

export function fetchUserApplicationData(sources: any, opportunityKey: string, userKey: string) {
  return sources.query$.query(USER_APPLICATION, { opportunityKey, userKey })
    .tap(console.warn.bind(console, 'USER_APPLICATION fetch event'));
}

export function reShapeEventData(formData: any, step: Step) {
  switch (step) {
    case STEP_ABOUT :
      const { superPower, birthday, phone, preferredName, zipCode, legalName } = formData;
      return {
        about: {
          aboutYou: { superPower },
          personal: { birthday, phone, preferredName, zipCode, legalName }
        },
      }

    case STEP_QUESTION :
      const { answer } = formData;
      return {
        questions: { answer: answer }
      }

    case STEP_TEAMS :
      // in this case, no event data, updates have already been made directly in the model
      return {};

    default:
      throw 'internal error : unconfigured step encountered in the application process state' +
      ' machine'
  }
}

export function makeRequestToUpdateUserApplication(model: UserApplicationModel, eventData: any) {
  console.log('action_request : eventData : AboutStateRecord', eventData);
  const formData = eventData.formData;
  const { userApplication } = model;
  if (!userApplication) {
    throw 'internal error: model at this stage must have userApplication property set!';
  }
  const step = userApplication.progress.step;
  console.log('makeRequestToUpdateUserApplication: step', step);

  const updates = reShapeEventData(formData, step);
  const newUserApplication = merge(userApplication, updates);

  // TODO : but even better is to have the firebase update be an update not a set operation!!
  // this means less traffic towards the server

  return {
    context: USER_APPLICATION,
    command: UPDATE,
    payload: newUserApplication
  }
}

function _updateModelWithStepAndError(updateModelFn: Function, step: Step, model: FSM_Model, eventData: EventData,
                                      actionResponse: DomainActionResponse) {
  console.log('_updateModelWithStepAndError');
  const { err } = actionResponse;

  return flatten([
    updateModelFn(model, eventData.formData, actionResponse),
    addOpToJsonPatch('/userApplication/progress/step', step),
    addOpToJsonPatch('/errorMessage', err ? err.toString() : 'internal error! there should be an error message')
  ])
}
export const updateModelWithStepAndError = curry(_updateModelWithStepAndError);

function _updateModelWithValidationMessages(updateModelFn: Function, step: Step, model: FSM_Model, eventData: any, actionResponse: any) {
  void actionResponse, model; // no request for the transition leading to this model update
  const { validationData } = eventData;
  console.log('_updateModelWithValidationMessages');

  return flatten([
    updateModelFn(model, eventData, actionResponse),
    toJsonPatch('/validationMessages')(validationData),
    addOpToJsonPatch('/userApplication/progress/step', step),
  ])
}
export const updateModelWithValidationMessages = curry(_updateModelWithValidationMessages);

export function updateModelWithAboutData(model: FSM_Model, eventData: EventData,
                                         actionResponse: DomainActionResponse) {
  console.log('updateModelWithAboutData');
  void actionResponse, model;
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, formData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, formData)),
    addOpToJsonPatch('/userApplication/progress/step', STEP_QUESTION),
    toJsonPatch('/errorMessage')(null),
  ])
}

export function updateModelWithQuestionData(model: FSM_Model, eventData: EventData,
                                            actionResponse: DomainActionResponse) {
  void actionResponse, model;
  console.log('updateModelWithQuestionData');
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/questions')(pick(questionFields, formData)),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAMS),
    toJsonPatch('/errorMessage')(null),
  ])
}

export function updateModelWithSelectedTeamData(model: FSM_Model, eventData: Number,
                                                actionResponse: DomainActionResponse) {
  void actionResponse, model;
  const selectedTeamIndex = eventData;

  console.log('updateModelWithSelectedTeamData', eventData);

  return flatten([
    addOpToJsonPatch('/userApplication/progress/latestTeamIndex', selectedTeamIndex),
  ])
}

///////
// Event guards

function _isStepX(targetStep: Step, model: FSM_Model, eventData: EventData) {
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
export const isStep = curry(_isStepX);

export function isFormValid(model: FSM_Model, eventData: EventData) {
  void model;
  return pipe(values, all(isBoolean))(eventData.validationData)
}

export function hasJoinedAtLeastOneTeam(model: UserApplicationModelNotNull, eventData: EventData) {
  const { userApplication : { teams } } = model;
  const _hasJoinedAtLeastOneTeam = any((teamKey: string) => {
    return teams[teamKey].alreadyFilledIn
  }, keys(teams));
  console.log('hasJoinedAtLeastOneTeam', _hasJoinedAtLeastOneTeam);

  return _hasJoinedAtLeastOneTeam;
}

///////
// Events

// We just read the god damn values from the dom directly
// Events are executed prior to starting the state machine, so they can't take into
// account the model, hence also not the initial value for the fields. And the repository
// does not have the current value of the fields either. So only way is this
export function aboutContinueEventFactory(sources: any, settings: any) {
  // should continue only if all fields have been validated
  void settings;

  return sources.dom.select('button.c-application__submit--about').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'submit button clicked'))
    .map((x: any) => {
      void x;
      const formData = getAboutFormData();

      return {
        formData,
        validationData: validateScreenFields(aboutScreenFieldValidationSpecs, formData)
      }
    })
    .tap(console.warn.bind(console, 'validation About fields performed'))
}

export function questionContinueEventFactory(sources: any, settings: any) {
  // should continue only if all fields have been validated
  void settings;

  return sources.dom.select('button.c-application__submit--question').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'submit button clicked'))
    .map((x: any) => {
      void x;
      const formData = getQuestionFormData();

      return {
        formData,
        validationData: validateScreenFields(questionScreenFieldValidationSpecs, formData)
      }
    })
    .tap(console.warn.bind(console, 'validation Question fields performed'))
}

// @returns Stream<Number> returns the index of the team which has been clicked or throws
export function teamClickedEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__teams-list').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'team list area clicked'))
    .map((e: Event) => {
      const target = e.target as Element;
      const elIndex = target.getAttribute('data-index');

      if (!elIndex) {
        throw `teamClickedEventFactory : could not find (team) target for click!`
      }

      return elIndex
    })
    .tap(console.warn.bind(console, 'team index'))
}

export function teamContinueEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__submit--teams').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'teamContinueEventFactory : submit button clicked'))
}

///////
// Actions
export function checkActionResponseIsSuccess(model: FSM_Model, actionResponse: DomainActionResponse) {
  void model;
  const { err } = actionResponse;
  return !err;
}
