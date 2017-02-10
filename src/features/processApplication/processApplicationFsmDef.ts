import { Stream, just } from 'most';
import { div } from '@motorcycle/dom';
import { all, flip, pipe, values, T } from 'ramda';
import {
  EV_GUARD_NONE, ACTION_REQUEST_NONE, ACTION_GUARD_NONE, INIT_EVENT_NAME, INIT_STATE
} from '../../components/properties';
import { modelUpdateIdentity } from '../../utils/FSM';
import {
  STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW, UserApplicationModel, AboutStateRecord
} from '../../types/processApplication';
import {
  aboutComponent, aboutScreenFieldValidationSpecs, getAboutFormData, validateAboutScreenFields
} from './aboutComponent';
import { Transitions, FSM_Model } from '../../components/types';
import { DomainActionResponse } from '../../types/repository';
import {
  fetchUserApplicationModelData, isStep, initializeModel, makeRequestToUpdateUserApplication,
  updateModelWithAboutData, updateModelWithAboutDataAndError
} from './processApplicationFsmFns';
import { isBoolean } from '../../utils/utils';
import { questionComponent } from './questionComponent';

const INIT_S = 'INIT';
const STATE_ABOUT = 'About';
const STATE_QUESTION = 'Question';
const STATE_TEAMS = 'Teams';
const STATE_REVIEW = 'Review';

const FETCH_EV = 'fetch';
const ABOUT_CONTINUE = 'about_continue';

const sinkNames = ['dom', 'domainAction$'];

export const events = {
  [FETCH_EV]: fetchUserApplicationModelData,
  [ABOUT_CONTINUE]: (sources: any, settings: any) => {
    // should continue only if all fields have been validated
    void settings;
    void validateAboutScreenFields, aboutScreenFieldValidationSpecs, all, pipe, values, isBoolean;

    // TODO : check response is received
    // TODO : check that state is changed and new view is displayed
    // We just read the god damn values from the dom directly
    // Events are executed prior to starting the state machine, so they can't take into
    // account the model, hence also not the initial value for the fields. And the repository
    // does not have the current value of the fields either. So only way is this
    return sources.dom.select('form.c-application__form').events('submit')
      .map(getAboutFormData)
      .tap(console.warn.bind(console, 'sumbit button clicked'))
      .thru(validateAboutScreenFields(aboutScreenFieldValidationSpecs))
      .tap(console.warn.bind(console, 'validation performed'))
      .filter(pipe(values, all(isBoolean)))
      .tap(console.warn.bind(console, 'passed validation'))
      .map(getAboutFormData)
      .tap(console.warn.bind(console, 'field passed validation results')) as Stream <AboutStateRecord>
  }
};

export const transitions: Transitions = {
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

export const entryComponents = {
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
  [STATE_QUESTION]: function showViewStateQuestion(model: UserApplicationModel) {
    return flip(questionComponent)({ model })
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

export const fsmSettings = {
  initial_model: {},
  init_event_data: {},
  sinkNames: sinkNames
};

