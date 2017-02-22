import { merge } from 'ramda';
import { USER_APPLICATION, UPDATE } from '../../domain';
import {
  STEP_ABOUT, Step, UserApplicationModel, STEP_QUESTION, STEP_TEAMS, STEP_TEAM_DETAIL
} from '../../types/processApplication';
import { FSM_Model } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';

///////
// Helpers
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
      // in this case, no form data, updates have already been made directly in the model
      return {};

    case STEP_TEAM_DETAIL :
    // in this case, no form data, updates have already been made directly in the model
      return {};

    default:
      throw 'internal error : unconfigured step encountered in the application process state' +
      ' machine'
  }
}

///////
// Action requests
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

///////
// Action guards
export function checkActionResponseIsSuccess(model: FSM_Model, actionResponse: DomainActionResponse) {
  void model;
  const { err } = actionResponse;
  return !err;
}
