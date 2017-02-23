import {
  complement, isNil, identity, any, merge, pipe, values, all, map, filter, keys, always, curry, zipObj, pick, flatten
} from 'ramda';
import { preventDefault, isBoolean } from '../../utils/utils';
import {
  getAboutFormData, getQuestionFormData, getTeamDetailFormData
} from './processApplicationFetch';
import {
  validateScreenFields, aboutScreenFieldValidationSpecs, questionScreenFieldValidationSpecs,
  teamDetailScreenFieldValidationSpecs
} from './processApplicationValidation';
import {
  Step, UserApplicationModelNotNull, UserApplication, STEP_REVIEW, STEP_ABOUT
} from '../../types/processApplication';
import { FSM_Model, EventData } from '../../components/types';

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

      // Note : parsing to int because otherwise it is a string and that messes increment by 1 op.
      return elIndex == null
        ? null
        : parseInt(elIndex)
    })
    // it can happen that the click is on the div but not on a data-index element => elIndex = null
    // Note that isNil is used and not identity, otherwise elIndex = 0 would be filtered out
    .filter(complement(isNil))
    .tap(console.warn.bind(console, 'team index'))
}

export function teamContinueEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__submit--teams').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'teamContinueEventFactory : submit button clicked'))
}

export function skipTeamClickedEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__submit--team_detail_skip').events('click')
    .tap(preventDefault)
    .map((x:any) => ({formData: getTeamDetailFormData()}))
    .tap(console.warn.bind(console, 'skipTeamClickedEventFactory : button clicked'))
}

export function joinTeamClickedEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__submit--team_detail_join').events('click')
    .tap(preventDefault)
    .map((x: any) => {
      void x;
      const formData = getTeamDetailFormData();

      return {
        formData,
        validationData: validateScreenFields(teamDetailScreenFieldValidationSpecs, formData)
      }
    })
    .tap(console.warn.bind(console, 'joinTeamClickedEventFactory : button clicked'))
}

export function backTeamClickedEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__team_detail-back').events('click')
    .tap(preventDefault)
    .map(getTeamDetailFormData)
    .tap(console.warn.bind(console, 'backTeamClickedEventFactory : button clicked'))
}

export function changeAboutEventFactory(sources: any, settings: any) {
  void settings;
// TODO : I am here
  return sources.dom.select('.c-application__change--about').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'changeAboutEventFactory : button clicked'))
}

export function changeQuestionEventFactory(sources: any, settings: any) {
  void settings;
// TODO : I am here
  return sources.dom.select('.c-application__change--question').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'changeQuestionEventFactory : button clicked'))
}

export function changeTeamsEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__change--teams').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'changeTeamsEventFactory : button clicked'))
}

export function applicationCompletedEventFactory(sources: any, settings: any) {
  void settings;

  return sources.dom.select('.c-application__review--submit').events('click')
    .tap(preventDefault)
    .tap(console.warn.bind(console, 'applicationCompletedEventFactory : button clicked'))
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

export function hasReachedReviewStep(model: UserApplicationModelNotNull, eventData: EventData) {
  void eventData;
  const {userApplication : {progress : {hasReviewedApplication}}} = model;

  return hasReviewedApplication
}

export function hasJoinedAtLeastOneTeam(model: UserApplicationModelNotNull, eventData: EventData) {
  const { userApplication : { teams } } = model;
  const _hasJoinedAtLeastOneTeam = any((teamKey: string) => {
    return teams[teamKey].hasBeenJoined
  }, keys(teams));
  console.log('hasJoinedAtLeastOneTeam', _hasJoinedAtLeastOneTeam);

  return _hasJoinedAtLeastOneTeam;
}
