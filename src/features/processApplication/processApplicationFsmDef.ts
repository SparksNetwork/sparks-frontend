import { just } from 'most';
import { div } from '@motorcycle/dom';
import { flip, T } from 'ramda';
import {
  EV_GUARD_NONE, ACTION_REQUEST_NONE, ACTION_GUARD_NONE, INIT_EVENT_NAME, INIT_STATE
} from '../../components/properties';
import { modelUpdateIdentity } from '../../utils/FSM';
import {
  STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW, UserApplicationModel, STEP_TEAM_DETAIL
} from '../../types/processApplication';
import { renderComponent } from './processApplicationRender';
import { Transitions } from '../../components/types';
import {
  makeRequestToUpdateUserApplication, checkActionResponseIsSuccess
} from './processApplicationActions';
import {
  fetchUserApplicationModelData, initializeModel, updateModelWithAboutData,
  updateModelWithQuestionData, updateModelWithStepAndError, updateModelWithValidationMessages,
  updateModelWithSelectedTeamData, updateModelWithSkippedTeamData, updateModelWithJoinedTeamData,
  updateModelWithAnswerAndStep, updateModelWithStepOnly, updateModelWithTeamDetailAnswerData
} from './processApplicationModelUpdates';
import {
  isStep, isFormValid, aboutContinueEventFactory, questionContinueEventFactory,
  teamClickedEventFactory, hasJoinedAtLeastOneTeam, teamContinueEventFactory,
  skipTeamClickedEventFactory, joinTeamClickedEventFactory, backTeamClickedEventFactory,
  changeAboutEventFactory, changeQuestionEventFactory, changeTeamsEventFactory
} from './processApplicationEvents';

const INIT_S = 'INIT';
const STATE_ABOUT = 'About';
const STATE_QUESTION = 'Question';
const STATE_TEAMS = 'Teams';
const STATE_TEAM_DETAIL = 'Team_Detail';
const STATE_REVIEW = 'Review';

const FETCH_EV = 'fetch';
const ABOUT_CONTINUE = 'about_continue';
const QUESTION_CONTINUE = 'question_continue';
const TEAM_CLICKED = 'team_clicked';
const SKIP_TEAM_CLICKED = 'skip_team_clicked';
const JOIN_TEAM_CLICKED = 'join_team_clicked';
const BACK_TEAM_CLICKED= 'back_team_clicked';
const TEAM_CONTINUE = 'team_continue';
const CHANGE_ABOUT = 'change_about';
const CHANGE_QUESTION = 'change_question';
const CHANGE_TEAMS = 'change_teams';

const sinkNames = ['dom', 'domainAction$'];

export const events = {
  [FETCH_EV]: fetchUserApplicationModelData,
  [ABOUT_CONTINUE]: aboutContinueEventFactory,
  [QUESTION_CONTINUE]: questionContinueEventFactory,
  [TEAM_CLICKED]: teamClickedEventFactory,
  [SKIP_TEAM_CLICKED]: skipTeamClickedEventFactory,
  [JOIN_TEAM_CLICKED]: joinTeamClickedEventFactory,
  [BACK_TEAM_CLICKED] : backTeamClickedEventFactory,
  [TEAM_CONTINUE]: teamContinueEventFactory,
  [CHANGE_ABOUT]: changeAboutEventFactory,
  [CHANGE_QUESTION]: changeQuestionEventFactory,
  [CHANGE_TEAMS]: changeTeamsEventFactory,
};

// If there is an error updating the model, keep in the same state
// It is important to update the model locally even if the update could not go in the
// remote repository, so that when the view is shown the already entered
// values are shown
// TODO : same would be nice while saving to remote to show some message `pending...` = feature
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
        // Case form has only valid fields
        event_guard: isFormValid,
        re_entry: true,
        action_request: {
          driver: 'domainAction$',
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: [
          {
            action_guard: checkActionResponseIsSuccess,
            target_state: STATE_QUESTION,
            // keep model in sync with repository
            model_update: updateModelWithAboutData
          },
          {
            action_guard: T,
            target_state: STATE_ABOUT,
            model_update: updateModelWithStepAndError(updateModelWithAboutData, STEP_ABOUT)
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
            target_state: STATE_ABOUT,
            // keep model in sync with repository
            model_update: updateModelWithValidationMessages(updateModelWithAboutData, STEP_ABOUT)
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
        // Case form has only valid fields
        event_guard: isFormValid,
        re_entry: true,
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
        // Case form has invalid fields
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_QUESTION,
            // keep model in sync with repository
            model_update: updateModelWithValidationMessages(updateModelWithQuestionData, STEP_QUESTION)
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
  fromTeamDetailScreenJoinClick: {
    origin_state: STATE_TEAM_DETAIL,
    event: JOIN_TEAM_CLICKED,
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
            model_update: updateModelWithJoinedTeamData
          },
        ]
      },
      {
        // Case form has soem invalid field(s)
        event_guard: T,
        re_entry: true,
        action_request: ACTION_REQUEST_NONE,
        transition_evaluation: [
          {
            action_guard: T,
            target_state: STATE_TEAM_DETAIL,
            model_update: updateModelWithValidationMessages(updateModelWithTeamDetailAnswerData, STEP_TEAM_DETAIL)
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
            model_update: updateModelWithAnswerAndStep
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
          request: makeRequestToUpdateUserApplication
        },
        transition_evaluation: [
          {
            action_guard: checkActionResponseIsSuccess,
            target_state: STATE_REVIEW,
            model_update: updateModelWithStepOnly(STEP_REVIEW)
          },
          {
            action_guard: T,
            target_state: STATE_TEAMS,
            model_update: updateModelWithStepAndError(modelUpdateIdentity, STEP_TEAMS)
          }
        ]
      },
    ]
  },
  fromReviewScreenToAbout: {
    origin_state: STATE_REVIEW,
    event: CHANGE_ABOUT,
    target_states: [
      {
        event_guard: T,
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
  [STATE_TEAMS]: function (model: UserApplicationModel) {
    return flip(renderComponent(STATE_TEAMS))({ model })
  },
  [STATE_TEAM_DETAIL]: function (model: UserApplicationModel) {
    return flip(renderComponent(STATE_TEAM_DETAIL))({ model })
  },
  // TODO : same here
  [STATE_REVIEW]: function (model: UserApplicationModel) {
    return flip(renderComponent(STATE_REVIEW))({ model })
  },
};

export const fsmSettings = {
  initial_model: {},
  init_event_data: {},
  sinkNames: sinkNames
};

