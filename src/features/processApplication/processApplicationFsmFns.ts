import { Stream, combineArray } from 'most';
import { pipe, values, all, map, filter, keys, always, curry, zipObj, pick, flatten } from 'ramda';
import { OPPORTUNITY, USER_APPLICATION, TEAMS, UPDATE } from '../../domain';
import { toJsonPatch } from '../../utils/FSM';
import { Opportunity, Teams, Team } from '../../types/domain';
import { FirebaseUserChange } from '../../drivers/firebase-user';
import {
  UserApplication, STEP_ABOUT, STEP_REVIEW, Step, ApplicationTeamInfo, TeamsInfo,
  ApplicationQuestionInfo, Progress, ApplicationAboutInfo, UserApplicationModel, aboutYouFields,
  personalFields
} from '../../types/processApplication';
import { FSM_Model, EventData } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';
import { isBoolean } from '../../utils/utils';

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
      alreadyVisited: false
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
          latestTeam: ''
        } as Progress
      },
      validationMessages : {}
    }
  }
  else {
    // Note: we reference the user application in the model, we should make sure that the user
    // application is immutable, otherwise it will spill in the model
    // TODO : check validity of userApp coming from repository or not??
    initialModel = { user, opportunity, teams, userApplication, errorMessage: null, validationMessages:{} }
  }

  return toJsonPatch('')(initialModel);
}

export function fetchUserApplicationModelData(sources: any, settings: any) {
  const { user$ } = sources;
  const { opportunityKey, userKey } = settings;
  const userApp$ = fetchUserApplicationData(sources, opportunityKey, userKey);
  const teams$ = sources.query$.query(TEAMS, {})
    .tap(console.warn.bind(console, 'TEAMS fetch event'));
  const opportunities$: Stream<Opportunity> = sources.query$.query(OPPORTUNITY, { opportunityKey })
    .tap(console.warn.bind(console, 'OPPORTUNITY fetch event'));

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
        validationMessages : {}
      }),
    [user$, opportunities$, userApp$, teams$]
  )
    .tap(console.warn.bind(console, 'combined user, userapp, teams fetch event'))
    .take(1)
}

export function makeRequestToUpdateUserApplication(model: UserApplicationModel, eventData: any) {
  console.log('action_request : eventData :AboutStateRecord', eventData);
  const formData = eventData.formData;
  if (!model.userApplication) {
    throw 'internal error: model at this stage must have' +
    ' userApplication property set!';
  }

  // Build user application :
  // - from the about fields (event data)
  // - from the past information stored in the current value of model
  // NOTE : userApplication should always exist, it is created by FETCH_EV event
  const userApplication: UserApplication = {
    userKey: model.userApplication.userKey,
    opportunityKey: model.userApplication.opportunityKey,
    about: {
      aboutYou: {
        superPower: formData.superPower
      },
      personal: {
        birthday: formData.birthday,
        phone: formData.phone,
        preferredName: formData.preferredName,
        zipCode: formData.zipCode,
        legalName: formData.legalName
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

export function updateModelWithAboutDataAndError(model: FSM_Model, eventData: EventData,
                                                 actionResponse: DomainActionResponse) {
  const { err } = actionResponse;
  // By construction err cannot be null, but typescript will force to consider that case

  return flatten([
    updateModelWithAboutData(model, eventData.formData, actionResponse),
    {
      op: 'add',
      path: '/errorMessage',
      value: err ? err.toString() : 'internal error! there should be an error message'
    }
  ])
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
export const isStep = curry(_isStepX);

export function fetchUserApplicationData(sources: any, opportunityKey: string, userKey: string) {
  return sources.query$.query(USER_APPLICATION, { opportunityKey, userKey })
    .tap(console.warn.bind(console, 'USER_APPLICATION fetch event'));
}

export function updateModelWithAboutData(model: FSM_Model, eventData: EventData,
                                         actionResponse: DomainActionResponse) {
  void actionResponse, model;
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, formData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, formData)),
    toJsonPatch('/errorMessage')(null),
  ])
}

export function isAboutFormValid(model: any, eventData: any) {
  void model;
  return pipe(values, all(isBoolean))(eventData.validationData)
}

