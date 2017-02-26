///<reference path="../../types/processApplication.ts"/>
import { h2, div, input, form, label, ul, li, span, button } from '@motorcycle/dom';
import { just } from 'most';
import { none, filter, flatten, keys, values, curry, map, addIndex } from 'ramda';
import {
  applicationProcessSteps, Step, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW,
  UserApplicationModelNotNull, STEP_TEAM_DETAIL, STEP_APPLIED
} from '../../types/processApplication';
import { makeErrDiv, makeInputProps } from '../../utils/dom';
import { State } from '../../components/types';
const format = require('fmt-obj');
const mapIndexed = addIndex(map);

//////
// Render functions

function renderApplicationProcessAbout(model: UserApplicationModelNotNull) {
  let superPower, legalName, preferredName, phone, birthday, zipCode;

  // second guard is because of typescript null type checking
  // by construction initialRendering <=> model != null, so no harm is done
  console.info('entered renderApplicationProcessAbout');

  if (model != null) {
    ({
      userApplication: {
        about: {
          aboutYou: { superPower },
          personal: { legalName, preferredName, phone, birthday, zipCode }
        },
      }
    } = model);
  }

  console.log('form data', superPower, legalName, preferredName, phone, birthday, zipCode);
  console.log('validation', model.validationMessages);
  const _makeErrDiv = makeErrDiv(model.validationMessages);

  return [
    ul('.c-application__about', [
        li('.c-application__list-item', [
          div('.c-application__about-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--super-power',
                makeInputProps(superPower, 0))
            ]),
            span('.c-textfield__label', 'About you')
          ]),
          _makeErrDiv('superPower', '.c-textfield__error.c-textfield__error--super-power')
        ]),
      ]
    ),
    ul('.c-application__personal-details', [
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--legal-name',
              makeInputProps(legalName, 1))
          ]),
          span('.c-textfield__label', 'Legal name')
        ]),
        _makeErrDiv('legalName', '.c-textfield__error.c-textfield__error--legal-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--preferred-name',
              makeInputProps(preferredName, 2))
          ]),
          span('.c-textfield__label', 'Preferred name')
        ]),
        _makeErrDiv('preferredName', '.c-textfield__error.c-textfield__error--preferred-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--phone',
              makeInputProps(phone, 3))
          ]),
          span('.c-textfield__label', 'Phone')
        ]),
        _makeErrDiv('phone', '.c-textfield__error.c-textfield__error--phone')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--birthday',
              makeInputProps(birthday, 4))
          ]),
          span('.c-textfield__label', 'Birthday')
        ]),
        _makeErrDiv('birthday', '.c-textfield__error.c-textfield__error--birthday')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--zip-code',
              makeInputProps(zipCode, 5))
          ]),
          span('.c-textfield__label', 'Zip code')
        ]),
        _makeErrDiv('zipCode', '.c-textfield__error.c-textfield__error--zip-code')
      ]),
    ]),
    ul('.c-application__personal-details', [
      li('.c-sign-in__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--about', `Continue`),
      ]),
    ])
  ]
}

function renderApplicationProcessQuestion(model: UserApplicationModelNotNull): any {
  let answer;

  const { opportunity: { question } } = model;

  console.info('entered renderApplicationProcessQuestion', question);

  if (model != null) {
    ({
      userApplication: {
        questions: {
          answer
        },
      }
    } = model);
  }

  console.log('form data', answer);
  console.log('validation', model.validationMessages);
  const _makeErrDiv = makeErrDiv(model.validationMessages);

  return [
    div('.c-application__question-div.c-title', question),
    ul('.c-application__question-list', [
        li('.c-application__list-item', [
          div('.c-application__question-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--answer',
                makeInputProps(answer, 0))
            ]),
            span('.c-textfield__label', `Organizer's question`)
          ]),
          _makeErrDiv('answer', '.c-textfield__error.c-textfield__error--answer')
        ]),
      ]
    ),
    ul('.c-application__question-details', [
      li('.c-application__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--question', `Continue`),
      ]),
    ])
  ]
}

function renderApplicationProcessTeams(model: UserApplicationModelNotNull): any {
  const { userApplication: { teams } } = model;
  const dbTeams = model.teams;
  const teamKeys = keys(dbTeams);
  // disabled true <=> hasJoinedAtLeastOneTeam
  const disabled = none((teamKey: string) => {
    return teams[teamKey].hasBeenJoined
  }, keys(teams));
  console.log('disabled', disabled);

  return [
    div('.c-application__teams-title', 'Select a team'),
    ul('.c-application__teams-list',
      mapIndexed((teamKey: string, index: Number) => {
        const { description, name, question } = dbTeams[teamKey];
        const { hasBeenJoined, answer } = teams[teamKey];

        return void 0,
          li('.c-application__list-item', [
            span('.c-icon__visited', hasBeenJoined ? `o` : 'x'),
            div('.c-application__teams-div', { attrs: { 'data-index': index } }, `${name}`),
          ])
      }, teamKeys)
    ),
    ul('.c-application__teams-details', [
      li('.c-application__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--teams',
          { props: { disabled: disabled } },
          // { },
          `Continue`),
      ]),
    ])
  ]
}

function renderApplicationProcessTeamDetail(model: UserApplicationModelNotNull): any {
  const {
          userApplication: { progress : { latestTeamIndex }, teams },
          validationMessages,
          teams: dbTeams
        } = model;
  const latestTeamKey = keys(dbTeams)[latestTeamIndex];
  const { name, description, question } = dbTeams[latestTeamKey];
  const { answer, hasBeenJoined } = teams[latestTeamKey];
  const _makeErrDiv = makeErrDiv(validationMessages);
  console.log('makeInputProps answer', makeInputProps(answer, latestTeamIndex), answer);

  return [
    button('.c-application__team_detail-back', 'Back to teams'),
    div('.c-application__team_detail-name', `${name}`),
    div('.c-application__team_detail-description', `${description}`),
    div('.c-application__team_detail-question', `${question}`),
    ul('.c-application__team_detail--team', [
        li('.c-application__list-item', [
          div('.c-application__team_detail-div.c-textfield', [
            label([
              input(`.c-textfield__input.c-textfield__input--team_detail_answer.${latestTeamIndex}`,
                makeInputProps(answer, latestTeamIndex))
            ]),
            span('.c-textfield__label', 'Please enter your answer here')
          ]),
          _makeErrDiv('answer', '.c-textfield__error.c-textfield__error--team_detail_answer')
        ]),
      ]
    ),
    ul('.c-application__team_detail-details', [
      li('.c-application__list-item', [
        button('.c-btn.c-btn--quiet.c-application__submit--team_detail_skip',
          // NOTE!!! have to put disabled false to avoid a snabbdom bug? the past disabled attribute
          // from past button remains
          { props: { disabled: false } }, `Skip this team`),
      ]),
      li('.c-application__list-item', [
        hasBeenJoined
          ? button('.c-btn.c-btn--primary.c-application__submit--team_detail_join', `Unjoin team`)
          : button('.c-btn.c-btn--primary.c-application__submit--team_detail_join', `Join team`)
      ]),
    ])
  ]
}

function renderApplicationProcessReview(model: UserApplicationModelNotNull): any {
  void model;

  return flatten([
    renderAboutYouList(model),
    renderTeamSelectionList(model),
    renderOrganizerQuestionList(model),
    renderApplyButton(model)
  ])
}

function renderAboutYouList(model: UserApplicationModelNotNull) {
  const {
          userApplication: {
            about: {
              aboutYou: { superPower },
              personal: { legalName, preferredName, phone, birthday, zipCode }
            },
          }
        } = model;

  return [
    div('.c-application__review--about-title', 'About you'),
    ul('.c-application__review--about', [
        li('.c-application__review__list-item--super-power', superPower),
        li('.c-application__review__list-item--legal-name', legalName),
        li('.c-application__review__list-item--preferred-name', preferredName),
        li('.c-application__review__list-item--phone', phone),
        li('.c-application__review__list-item--birthday', birthday),
        li('.c-application__review__list-item--zipCode', zipCode),
      ]
    ),
    button('.c-btn.c-btn--quiet.c-application__change--about', 'Change')
  ]
}

function renderOrganizerQuestionList(model: UserApplicationModelNotNull) {
  const {
          opportunity : { question },
          userApplication: { questions: { answer }, }
        } = model;

  return [
    div('.c-application__review--question-title', `Organizer's question`),
    div('.c-application__review--question-description', question),
    ul('.c-application__review--question', [
        li('.c-application__review__list-item--answer', answer),
      ]
    ),
    button('.c-btn.c-btn--quiet.c-application__change--question', 'Change')
  ]
}

function renderTeamSelectionList(model: UserApplicationModelNotNull) {
  const {
          teams : dbTeams,
          userApplication: { teams, }
        } = model;
  const teamKeys = keys(teams);

  return flatten([
    div('.c-application__review--teams-title', `Team selection`),
    ul('.c-application__review--teams', flatten([
        map((teamkey: string) => {
          return li('.c-application__review__list-item--joined', dbTeams[teamkey].name)
        }, filter((teamkey: string) => {
          return teams[teamkey].hasBeenJoined
        }, teamKeys))
      ])
    ),
    button('.c-btn.c-btn--quiet.c-application__change--teams', 'Change')
  ])
}

function renderApplyButton(model: UserApplicationModelNotNull) {
  void model;

  return [
    button('.c-btn.c-btn--primary.c-application__review--submit', 'Apply for the things')
  ]
}

function renderApplicationProcessApplied(model: UserApplicationModelNotNull) {
  return [
    div(`.c-application__applied`, `You successfully applied! Stay in touch`)
  ]
}

function renderApplicationProcessStep(step: Step, model: UserApplicationModelNotNull) {
  switch (step) {
    case STEP_ABOUT :
      return renderApplicationProcessAbout(model);
    case STEP_QUESTION :
      return renderApplicationProcessQuestion(model);
    case STEP_TEAMS :
      return renderApplicationProcessTeams(model);
    case STEP_TEAM_DETAIL :
      return renderApplicationProcessTeamDetail(model);
    case STEP_REVIEW :
      return renderApplicationProcessReview(model);
    case STEP_APPLIED :
      return renderApplicationProcessApplied(model);
    default:
      throw 'internal error : unexpected step in the application process!'
    // break;
  }
}

function renderApplicationProcessTabs(step: Step) {
  return div('.c-application__progress-bar', map((_step: Step) => {
    return _step !== step
      ? div('.c-application__unselected-step', _step)
      : div('.c-application__selected-step', [h2(_step)])
  }, values(applicationProcessSteps)));
}

function render(model: UserApplicationModelNotNull) {
  const { opportunity, userApplication, errorMessage } = model;
  const { description } = opportunity;
  const { about, questions, teams, progress } = userApplication;
  const { step, hasApplied, latestTeamIndex } = progress;
  void about, questions, teams, hasApplied, latestTeamIndex;

  return div('#page', [
    div('.c-application', [
      div('.c-application__header', [
        div('.c-application__opportunity-title', description),
        div('.c-application__opportunity-icon', 'icon'),
        div('.c-application__opportunity-location', 'location'),
        div('.c-application__opportunity-date', 'date'),
      ]),
      div('.c-application__title', `Complete your application for ${description}`),
      div('.c-application__progress-bar', flatten([renderApplicationProcessTabs(step)])),
      form('.c-application__form', flatten([renderApplicationProcessStep(step, model)])),
      errorMessage
        ? div('.c-application__error', `An error occurred : ${errorMessage}`)
        : div('.c-application__error', '')
    ]),
  ]);
}

function _renderComponent(state: State, sources: any, settings: any) {
  void sources;
  const model: UserApplicationModelNotNull = settings.model;
  console.info(`entering ${state}`, model);

  return {
    dom: just(render(model))
  }
}
export const renderComponent = curry(_renderComponent);



