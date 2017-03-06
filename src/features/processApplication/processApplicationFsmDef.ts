import { just } from 'most';
import { div } from '@motorcycle/dom';
import { both, complement, flip, T } from 'ramda';
import {
  EV_GUARD_NONE, ACTION_REQUEST_NONE, ACTION_GUARD_NONE, INIT_EVENT_NAME, INIT_STATE
} from '../../components/properties';
import {
  modelUpdateIdentity, makeDefaultActionResponseProcessing, checkActionResponseIsSuccess
} from '../../utils/FSM';
import {
  STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW, UserApplicationModel, STEP_APPLIED
} from '../../types/processApplication';
import { renderComponent } from './processApplicationRender';
import { Transitions } from '../../components/types';
import {
  makeRequestToUpdateUserApplication,
  makeRequestToUpdateUserApplicationWithHasReviewed,
  makeRequestToUpdateUserApplicationWithHasApplied
} from './processApplicationActions';
import {
  initializeModel, updateModelWithAboutData, updateModelWithQuestionData,
  updateModelWithStepAndError, updateModelWithSelectedTeamData, updateModelWithSkippedTeamData,
  updateModelWithJoinedOrUnjoinedTeamData, updateModelWithTeamDetailAnswerAndNextStep,
  updateModelWithStepOnly, updateModelWithStepAndHasReviewed, updateModelWithAboutDataAndStepReview,
  updateModelWithQuestionDataAndStepReview, updateModelWithAppliedData,
  updateModelWithTeamDetailValidationMessages, updateModelWithAboutValidationMessages,
  updateModelWithQuestionValidationMessages, updateModelWithAboutDataAndStepQuestion,
  initializeModelAndStepReview
} from './processApplicationModelUpdates';
import {
  isStep, isFormValid, aboutContinueEventFactory, questionContinueEventFactory,
  teamClickedEventFactory, hasJoinedAtLeastOneTeam, teamContinueEventFactory,
  skipTeamClickedEventFactory, joinTeamClickedEventFactory, backTeamClickedEventFactory,
  changeAboutEventFactory, changeQuestionEventFactory, changeTeamsEventFactory,
  hasReachedReviewStep, applicationCompletedEventFactory, hasApplied
} from './processApplicationEvents';
import { fetchUserApplicationModelData } from './processApplicationFetch';

const INIT_S = 'INIT';
const STATE_ABOUT = 'About';
const STATE_QUESTION = 'Question';
const STATE_TEAMS = 'Teams';
const STATE_TEAM_DETAIL = 'Team Detail';
const STATE_REVIEW = 'Review';
const STATE_APPLIED = 'State Applied';

const FETCH_EV = 'fetch';
const ABOUT_CONTINUE = 'about_continue';
const QUESTION_CONTINUE = 'question_continue';
const TEAM_CLICKED = 'team_clicked';
const SKIP_TEAM_CLICKED = 'skip_team_clicked';
const JOIN_OR_UNJOIN_TEAM_CLICKED = 'join_team_clicked';
const BACK_TEAM_CLICKED = 'back_team_clicked';
const TEAM_CONTINUE = 'team_continue';
const CHANGE_ABOUT = 'change_about';
const CHANGE_QUESTION = 'change_question';
const CHANGE_TEAMS = 'change_teams';
const APPLICATION_COMPLETED = 'application_completed';

const sinkNames = ['dom', 'domainAction$'];

export const events = {
  [FETCH_EV]: fetchUserApplicationModelData,
  [ABOUT_CONTINUE]: aboutContinueEventFactory,
  [QUESTION_CONTINUE]: questionContinueEventFactory,
  [TEAM_CLICKED]: teamClickedEventFactory,
  [SKIP_TEAM_CLICKED]: skipTeamClickedEventFactory,
  [JOIN_OR_UNJOIN_TEAM_CLICKED]: joinTeamClickedEventFactory,
  [BACK_TEAM_CLICKED]: backTeamClickedEventFactory,
  [TEAM_CONTINUE]: teamContinueEventFactory,
  [CHANGE_ABOUT]: changeAboutEventFactory,
  [CHANGE_QUESTION]: changeQuestionEventFactory,
  [CHANGE_TEAMS]: changeTeamsEventFactory,
  [APPLICATION_COMPLETED]: applicationCompletedEventFactory
};

// If there is an error updating the model, keep in the same state
// It is important to update the model locally even if the update could not go in the
// remote repository, so that when the view is shown the already entered
// values are shown
// TODO : same would be nice while saving to remote to show some message `pending...` = feature
// The way to do this is to have ONE global pending internal FSM state which is associated to
// some action (think about how, if we update the view with a spinner, how?)
export const transitions: Transitions = {
  T_INIT: {
    origin_state: INIT_STATE,
    event: INIT_EVENT_NAME,
    target_states: [
      {
        event_guard: EV_GUARD_NONE,
        re_entry: true, // necessary as INIT is both target and current state in the beginning
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
        // whatever step the application is in, if the user has applied, we start with the review
        event_guard: hasApplied,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: ACTION_GUARD_NONE,
            target_state: STATE_REVIEW,
            // Business rule
            // if the user has applied, then he starts the app process route with the review stage
            model_update: initializeModelAndStepReview
          }
        ]
      },
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
  fromAboutScreen: {
    origin_state: STATE_ABOUT,
    event: ABOUT_CONTINUE,
    target_states: [
      {
        // Case form has only valid fields AND has NOT reached the review stage of the app
        event_guard: both(isFormValid, complement(hasReachedReviewStep)),
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: makeDefaultActionResponseProcessing({
          success: {
            target_state: STATE_QUESTION,
            model_update: updateModelWithAboutDataAndStepQuestion
          },
          error: {
            target_state: STATE_ABOUT,
            model_update: updateModelWithStepAndError(updateModelWithAboutData, STEP_ABOUT)
          }
        })
      },
      {
        // Case form has only valid fields AND has reached the review stage of the app
        event_guard: both(isFormValid, hasReachedReviewStep),
        re_entry: true,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: makeDefaultActionResponseProcessing({
          success: {
            target_state: STATE_REVIEW,
            model_update: updateModelWithAboutDataAndStepReview
          },
          error: {
            target_state: STATE_ABOUT,
            model_update: updateModelWithStepAndError(updateModelWithAboutData, STEP_ABOUT)
          }
        })
      },
      {
        // Case form has invalid fields
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_ABOUT,
            // keep model in sync with repository
            model_update: updateModelWithAboutValidationMessages
          },
        ]
      }
    ]
  },
  fromQuestionScreen: {
    origin_state: STATE_QUESTION,
    event: QUESTION_CONTINUE,
    target_states: [
      {
        // Case form has only valid fields AND has NOT reached the review stage of the app
        event_guard: both(isFormValid, complement(hasReachedReviewStep)),
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: [
          {
            action_guard: checkActionResponseIsSuccess,
            target_state: STATE_TEAMS,
            // keep model in sync with repository
            model_update: updateModelWithQuestionData
          },
          {
            action_guard: T,
            target_state: STATE_QUESTION,
            model_update: updateModelWithStepAndError(updateModelWithQuestionData, STEP_QUESTION)
          }
        ]
      },
      {
        // Case form has only valid fields AND has reached the review stage of the app
        event_guard: both(isFormValid, hasReachedReviewStep),
        re_entry: true,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: [
          {
            action_guard: checkActionResponseIsSuccess,
            target_state: STATE_REVIEW,
            // keep model in sync with repository
            model_update: updateModelWithQuestionDataAndStepReview
          },
          {
            action_guard: T,
            target_state: STATE_QUESTION,
            model_update: updateModelWithStepAndError(updateModelWithQuestionData, STEP_QUESTION)
          }
        ]
      },
      {
        // Case form has invalid fields
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_QUESTION,
            // keep model in sync with repository
            model_update: updateModelWithQuestionValidationMessages
          },
        ]
      }
    ]
  },
  fromTeamsScreenEventTeamClick: {
    origin_state: STATE_TEAMS,
    event: TEAM_CLICKED,
    target_states: [
      {
        event_guard: T,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAM_DETAIL,
            model_update: updateModelWithSelectedTeamData
          },
        ]
      },
    ]
  },
  fromTeamDetailScreenSkipClick: {
    origin_state: STATE_TEAM_DETAIL,
    event: SKIP_TEAM_CLICKED,
    target_states: [
      {
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAM_DETAIL,
            model_update: updateModelWithSkippedTeamData
          },
        ]
      },
    ]
  },
  fromTeamDetailScreenJoinOrUnjoinClick: {
    origin_state: STATE_TEAM_DETAIL,
    event: JOIN_OR_UNJOIN_TEAM_CLICKED,
    target_states: [
      {
        // Case form has only valid fields
        event_guard: isFormValid,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAM_DETAIL,
            model_update: updateModelWithJoinedOrUnjoinedTeamData
          },
        ]
      },
      {
        // Case form has some invalid field(s)
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAM_DETAIL,
            model_update: updateModelWithTeamDetailValidationMessages
          },
        ]
      },
    ]
  },
  fromTeamDetailScreenBackClick: {
    origin_state: STATE_TEAM_DETAIL,
    event: BACK_TEAM_CLICKED,
    target_states: [
      {
        event_guard: T,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAMS,
            model_update: updateModelWithTeamDetailAnswerAndNextStep
          },
        ]
      },
    ]
  },
  fromTeamsScreenToReview: {
    origin_state: STATE_TEAMS,
    event: TEAM_CONTINUE,
    target_states: [
      {
        event_guard: hasJoinedAtLeastOneTeam,
        re_entry: true,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplicationWithHasReviewed
        },
        transition_evaluation: makeDefaultActionResponseProcessing({
          success: {
            target_state: STATE_REVIEW,
            model_update: updateModelWithStepAndHasReviewed
          },
          error: {
            target_state: STATE_TEAMS,
            model_update: updateModelWithStepAndError(modelUpdateIdentity, STEP_TEAMS)
          }
        })
      },
    ]
  },
  fromReviewScreenToAbout: {
    origin_state: STATE_REVIEW,
    event: CHANGE_ABOUT,
    target_states: [
      {
        event_guard: EV_GUARD_NONE,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_ABOUT,
            model_update: updateModelWithStepOnly(STEP_ABOUT)
          },
        ]
      },
    ]
  },
  fromReviewScreenToQuestion: {
    origin_state: STATE_REVIEW,
    event: CHANGE_QUESTION,
    target_states: [
      {
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_QUESTION,
            model_update: updateModelWithStepOnly(STEP_QUESTION)
          },
        ]
      },
    ]
  },
  fromReviewScreenToTeams: {
    origin_state: STATE_REVIEW,
    event: CHANGE_TEAMS,
    target_states: [
      {
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAMS,
            model_update: updateModelWithStepOnly(STEP_TEAMS)
          },
        ]
      },
    ]
  },
  fromReviewScreenToApplied: {
    origin_state: STATE_REVIEW,
    event: APPLICATION_COMPLETED,
    target_states: [
      {
        // Case form has only valid fields AND has NOT reached the review stage of the app
        event_guard: T,
        re_entry: true,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplicationWithHasApplied
        },
        transition_evaluation: [
          {
            action_guard: checkActionResponseIsSuccess,
            target_state: STATE_APPLIED,
            // keep model in sync with repository
            model_update: updateModelWithAppliedData
          },
          {
            action_guard: T,
            target_state: STATE_ABOUT,
            model_update: updateModelWithStepAndError(updateModelWithAppliedData, STEP_APPLIED)
          }
        ]
      },
    ]
  },
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
    return flip(renderComponent(STATE_ABOUT))({ model })
  },
  [STATE_QUESTION]: function showViewStateQuestion(model: UserApplicationModel) {
    return flip(renderComponent(STATE_QUESTION))({ model })
  },
  [STATE_TEAMS]: function showViewStateTeams(model: UserApplicationModel) {
    return flip(renderComponent(STATE_TEAMS))({ model })
  },
  [STATE_TEAM_DETAIL]: function showViewStateTeamDetail(model: UserApplicationModel) {
    return flip(renderComponent(STATE_TEAM_DETAIL))({ model })
  },
  [STATE_REVIEW]: function showViewStateReview(model: UserApplicationModel) {
    return flip(renderComponent(STATE_REVIEW))({ model })
  },
  [STATE_APPLIED]: function showViewStateApplied(model: UserApplicationModel) {
    void model;

    // This is a transient state - display some loading indicator
    return function appliedComponent(sources: any, settings: any) {
      void sources, settings;

      return {
        dom: just(div('You successfully applied...'))
      }
    }
  },
};

export const fsmSettings = {
  initial_model: {},
  init_event_data: {},
  sinkNames: sinkNames,
  debug: true
};
