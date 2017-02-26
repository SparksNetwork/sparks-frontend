import { merge, keys, map, filter, always, curry, zipObj, pick, flatten } from 'ramda';
import { toJsonPatch, addOpToJsonPatch, chainModelUpdates, getSelectedKey } from '../../utils/FSM';
import { Opportunity, Teams, Team } from '../../types/domain';
import {
  UserApplicationModelNotNull, ApplicationTeamInfo, TeamsInfo, ApplicationQuestionInfo, Step,
  STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_TEAM_DETAIL, STEP_REVIEW, Progress,
  ApplicationAboutInfo, UserApplicationModel, aboutYouFields, personalFields, questionFields
} from '../../types/processApplication';
import { FSM_Model, EventData } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';
import { assertContract } from '../../utils/utils';
import { checkUserApplicationContracts } from '../../domain/contracts';


function _updateModelWithStepOnly(step: Step, model: UserApplicationModelNotNull, eventData: EventData,
                                  actionResponse: DomainActionResponse) {
  return flatten([addOpToJsonPatch('/userApplication/progress/step', step)])
}
export const updateModelWithStepOnly = curry(_updateModelWithStepOnly);

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
          hasReviewedApplication: false,
          latestTeamIndex: 0
        } as Progress
      },
      validationMessages: {}
    }
  }
  else {
    assertContract(checkUserApplicationContracts, [userApplication], `
user application read from the database is corrupted. 
Please check fields for correctness vs. expected format
`);

    // TODO : maybe to remove when I changed elsewhere initializeModelAndStepReview
    const {progress : {hasApplied, step}} = userApplication;
    const updatedUserApplication = hasApplied
      ? merge(userApplication, {progress : {step : STEP_REVIEW}})
      : userApplication;

    console.log('updatedUserApplication', userApplication);

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

export const initializeModelAndStepReview = chainModelUpdates([
  initializeModel,
  updateModelWithStepOnly(STEP_REVIEW)
]);

function _updateModelWithStepAndError(updateModelFn: Function, step: Step, model: FSM_Model,
                                      eventData: EventData, actionResponse: DomainActionResponse) {
  console.log('_updateModelWithStepAndError');
  const { err } = actionResponse;

  return flatten([
    updateModelFn(model, eventData.formData, actionResponse),
    addOpToJsonPatch('/userApplication/progress/step', step),
    addOpToJsonPatch('/errorMessage', err ? err.toString() : 'internal error! there should be an error message')
  ])
}
export const updateModelWithStepAndError = curry(_updateModelWithStepAndError);

export const updateModelWithAboutDataAndStepQuestion = chainModelUpdates([
  updateModelWithAboutData,
  updateModelWithEmptyErrorMessages,
  updateModelWithStepOnly(STEP_QUESTION)
]);

export const updateModelWithAboutDataAndStepReview = chainModelUpdates([
  updateModelWithAboutData,
  updateModelWithEmptyErrorMessages,
  updateModelWithStepOnly(STEP_REVIEW)
]);

export function updateModelWithAboutData(model: FSM_Model, eventData: EventData,
                                         actionResponse: DomainActionResponse) {
  console.log('updateModelWithAboutDataAndStepReview');
  const formData = eventData.formData;

  return flatten([
    toJsonPatch('/userApplication/about/aboutYou')(pick(aboutYouFields, formData)),
    toJsonPatch('/userApplication/about/personal')(pick(personalFields, formData)),
  ])
}

export function updateModelWithEmptyErrorMessages(model: FSM_Model, eventData: EventData,
                                                  actionResponse: DomainActionResponse) {
  console.log('updateModelWithEmptyErrorMessages');

  return flatten([toJsonPatch('/validationMessages')({}), toJsonPatch('/errorMessage')(null)])
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

function patchModelWithQuestionData(formData: any) {
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

export function updateModelWithJoinedOrUnjoinedTeamData(model: UserApplicationModelNotNull,
                                                        eventData: EventData,
                                                        actionResponse: DomainActionResponse) {
  const { teams : dbTeams, userApplication : { teams, progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(dbTeams);
  const numberOfTeams = teamKeys.length;
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { formData: { answer } } = eventData;
  const { hasBeenJoined } = teams[selectedTeamKey];
  // loop back to first team if met end of teams
  const nextTeamIndex = (latestTeamIndex + 1) % numberOfTeams;

  console.log('updateModelWithJoinedTeamData', latestTeamIndex, nextTeamIndex, selectedTeamKey, hasBeenJoined);

  return flatten([
    addOpToJsonPatch('/validationMessages', {}),
    addOpToJsonPatch('/userApplication/progress/latestTeamIndex', nextTeamIndex),
    addOpToJsonPatch('/userApplication/progress/step', STEP_TEAM_DETAIL),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/hasBeenJoined`, !hasBeenJoined),
  ])
}

export const updateModelWithTeamDetailAnswerAndNextStep = chainModelUpdates([
  updateModelWithStepOnly(STEP_TEAMS),
  updateModelWithTeamDetailAnswerData
]);

export function updateModelWithStepAndHasReviewed(model: UserApplicationModelNotNull, eventData: EventData,
                                                  actionResponse: DomainActionResponse) {
  return flatten([
    addOpToJsonPatch('/userApplication/progress/step', STEP_REVIEW),
    addOpToJsonPatch('/userApplication/progress/hasReviewedApplication', true),
  ])
}

export function updateModelWithAppliedData(model: UserApplicationModelNotNull, eventData: EventData,
                                           actionResponse: DomainActionResponse) {
  return flatten([addOpToJsonPatch('/userApplication/progress/hasApplied', true),])
}

function updateModelWithValidationData(model: UserApplicationModelNotNull, eventData: EventData,
                                       actionResponse: DomainActionResponse) {
  const { validationData } = eventData;
  console.log('updateModelWithValidationData', validationData);

  return toJsonPatch('/validationMessages')(validationData);
}

function updateModelWithTeamDetailAnswerData(model: UserApplicationModelNotNull, eventData: EventData,
                                             actionResponse: DomainActionResponse) {
  const { teams, userApplication : { progress:{ latestTeamIndex } } }= model;
  const teamKeys = keys(teams);
  const selectedTeamKey = getSelectedKey(latestTeamIndex, teamKeys);
  const { answer } = eventData;

  console.log('updateModelWithTeamDetailAnswerData', latestTeamIndex, selectedTeamKey, answer);

  return flatten([
    addOpToJsonPatch(`/userApplication/teams/${selectedTeamKey}/answer`, answer),
  ])
}

export const updateModelWithTeamDetailValidationMessages = chainModelUpdates([
  updateModelWithTeamDetailAnswerData,
  updateModelWithValidationData,
  updateModelWithStepOnly(STEP_TEAM_DETAIL)
]);

export const updateModelWithAboutValidationMessages = chainModelUpdates([
  updateModelWithAboutData,
  updateModelWithValidationData,
  updateModelWithStepOnly(STEP_ABOUT)
]);

export const updateModelWithQuestionValidationMessages = chainModelUpdates([
  updateModelWithQuestionData,
  updateModelWithValidationData,
  updateModelWithStepOnly(STEP_QUESTION)
]);
