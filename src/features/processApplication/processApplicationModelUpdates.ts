import { Stream, combineArray } from 'most';
import { keys, map, filter, always, curry, zipObj, pick, flatten } from 'ramda';
import { OPPORTUNITY, USER_APPLICATION, TEAMS } from '../../domain';
import { toJsonPatch, addOpToJsonPatch } from '../../utils/FSM';
import { Opportunity, Teams, Team } from '../../types/domain';
import { FirebaseUserChange } from '../../drivers/firebase-user';
import {
  UserApplication, STEP_ABOUT, Step, ApplicationTeamInfo, TeamsInfo, ApplicationQuestionInfo,
  Progress, ApplicationAboutInfo, UserApplicationModel, aboutYouFields, personalFields,
  STEP_QUESTION, STEP_TEAMS, questionFields, STEP_TEAM_DETAIL, UserApplicationModelNotNull,
  STEP_REVIEW
} from '../../types/processApplication';
import { FSM_Model, EventData } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';


///////
// Helpers
function getSelectedKey(latestTeamIndex:any, teamKeys:any){
  return teamKeys[latestTeamIndex];
}

///////
// Model updates
export function initializeModel(model: any, eventData: UserApplicationModel, actionResponse: any, settings: any) {
  void actionResponse, model;

  let initialModel: UserApplicationModel;
  const { userKey, opportunityKey } = settings;
  const { user, opportunity, teams, userApplication } = eventData;
  // opportunity here is the Opportunity whose key is somehow encoded in the URL
  // teams is all the teams in the database (!)

  if (!userApplication) {
    // we want to keep only the teams for the opportunity. For that, we get the project key in
    // the opportunity and keep only the team with that project key
    const { projectKey } = opportunity as Opportunity;

    // go through the teams, for each key, keep only those whose value satisfy a predicate
    const filteredTeamKeys = filter(teamKey => (teams[teamKey] as Team).projectKey === projectKey,
      keys(teams as Teams));
    const teamsInfo: TeamsInfo = zipObj(filteredTeamKeys, map(always({
      answer: '',
      hasBeenJoined: false
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
          hasReviewedApplication : false,
          latestTeamIndex: 0
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
  const { validationData } = eventData;
  console.log('_updateModelWithValidationMessages', validationData);

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
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, formData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, formData)),
    toJsonPatch('/validationMessages')({}),
    addOpToJsonPatch('/userApplication/progress/step', STEP_QUESTION),
    toJsonPatch('/errorMessage')(null),
  ])
}

export function updateModelWithAboutDataAndStepReview(model: FSM_Model, eventData: EventData,
                                                      actionResponse: DomainActionResponse) {
  console.log('updateModelWithAboutDataAndStepReview');
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, formData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, formData)),
    toJsonPatch('/validationMessages')({}),
    addOpToJsonPatch('/userApplication/progress/step', STEP_REVIEW),
    toJsonPatch('/errorMessage')(null),
  ])
}

export function updateModelWithQuestionDataAndStepReview(model: FSM_Model, eventData: EventData,
                                                      actionResponse: DomainActionResponse) {
  console.log('updateModelWithQuestionDataAndStepReview');
  const formData = eventData.formData;

  return flatten([
    patchModelWithQuestionData(formData),
    addOpToJsonPatch('/userApplication/progress/step', STEP_REVIEW),
  ])
}

export function updateModelWithQuestionData(model: FSM_Model, eventData: EventData,
                                            actionResponse: DomainActionResponse) {
  console.log('updateModelWithQuestionData');
  const formData = eventData.formData;

  return patchModelWithQuestionData(formData)
}

function patchModelWithQuestionData(formData:any){
  return flatten([
    toJsonPatch('/userApplication/questions')(pick(questionFields, formData)),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAMS),
    addOpToJsonPatch('/validationMessages', {}),
    addOpToJsonPatch('/errorMessage', null),
  ])
}

export function updateModelWithSelectedTeamData(model: FSM_Model, eventData: Number,
                                                actionResponse: DomainActionResponse) {
  const selectedTeamIndex = eventData;

  console.log('updateModelWithSelectedTeamData', eventData);

  return flatten([
    addOpToJsonPatch('/userApplication/progress/latestTeamIndex', selectedTeamIndex),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAM_DETAIL),
  ])
}

export function updateModelWithSkippedTeamData(model: UserApplicationModelNotNull, eventData: EventData,
                                               actionResponse: DomainActionResponse) {
  const { teams, userApplication : { progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(teams);
  const numberOfTeams = teamKeys.length;
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { formData: { answer } } = eventData;
  // loop back to first team if met end of teams
  const nextTeamIndex = (latestTeamIndex + 1) % numberOfTeams;

  console.log('updateModelWithSkippedTeamData', latestTeamIndex, selectedTeamKey, nextTeamIndex, answer);

  return flatten([
    addOpToJsonPatch('/validationMessages', {}),
    addOpToJsonPatch('/userApplication/progress/latestTeamIndex', nextTeamIndex),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAM_DETAIL),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
  ])
}

export function updateModelWithJoinedTeamData(model: UserApplicationModelNotNull, eventData: EventData,
                                              actionResponse: DomainActionResponse) {
  const { teams, userApplication : { progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(teams);
  const numberOfTeams = teamKeys.length;
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { formData: { answer } } = eventData;
  // loop back to first team if met end of teams
  const nextTeamIndex = (latestTeamIndex + 1) % numberOfTeams;

  console.log('updateModelWithJoinedTeamData', latestTeamIndex, nextTeamIndex, selectedTeamKey);

  return flatten([
    addOpToJsonPatch('/validationMessages', {}),
    addOpToJsonPatch('/userApplication/progress/latestTeamIndex', nextTeamIndex),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAM_DETAIL),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/hasBeenJoined`, true),
  ])
}

export function updateModelWithTeamDetailAnswerData(model: UserApplicationModelNotNull, eventData: EventData,
                                                    actionResponse: DomainActionResponse) {
  const { teams, userApplication : { progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(teams);
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { formData: { answer } } = eventData;

  console.log('updateModelWithJoinedTeamData', latestTeamIndex, selectedTeamKey);

  return flatten([
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAM_DETAIL),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
  ])
}


export function updateModelWithAnswerAndStep(model: UserApplicationModelNotNull, eventData: EventData,
                                             actionResponse: DomainActionResponse) {
  const { teams, userApplication : { progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(teams);
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { answer } = eventData;

  console.log('updateModelWithAnswerAndStep', latestTeamIndex, selectedTeamKey, answer);

  return flatten([
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAMS),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
  ])
}

function _updateModelWithStepOnly(step:Step, model: UserApplicationModelNotNull, eventData: EventData,
                                        actionResponse: DomainActionResponse) {
  return flatten([
    addOpToJsonPatch('/userApplication/progress/step', step),
  ])
}
export const updateModelWithStepOnly = curry(_updateModelWithStepOnly);

export function updateModelWithStepAndHasReviewed(model: UserApplicationModelNotNull, eventData: EventData,
                                                  actionResponse: DomainActionResponse) {
  return flatten([
    addOpToJsonPatch('/userApplication/progress/step', STEP_REVIEW),
    addOpToJsonPatch('/userApplication/progress/hasReviewedApplication', true),
  ])
}

export function updateModelWithAppliedData (model: UserApplicationModelNotNull, eventData: EventData,
                                        actionResponse: DomainActionResponse) {
  return flatten([
    addOpToJsonPatch('/userApplication/progress/hasApplied', true),
  ])
}
