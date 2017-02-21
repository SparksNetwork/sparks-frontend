import { a, div, input, form, label, ul, li, span, button } from '@motorcycle/dom';
import { just } from 'most';
import {
  flatten, keys, values, pipe, curry, isEmpty, cond, T, gt, length, mapObjIndexed, map, addIndex
} from 'ramda';
import {
  applicationProcessSteps, Step, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW,
  ValidationResult, UserApplicationModel, UserApplicationModelNotNull
} from '../../types/processApplication';
import { HashMap } from '../../types/repository';
import { getInputValue, makeErrDiv, makeInputProps } from '../../utils/dom';
import { isBoolean } from '../../utils/utils';
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
                makeInputProps(superPower))
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
              makeInputProps(legalName))
          ]),
          span('.c-textfield__label', 'Legal name')
        ]),
        _makeErrDiv('legalName', '.c-textfield__error.c-textfield__error--legal-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--preferred-name',
              makeInputProps(preferredName))
          ]),
          span('.c-textfield__label', 'Preferred name')
        ]),
        _makeErrDiv('preferredName', '.c-textfield__error.c-textfield__error--preferred-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--phone',
              makeInputProps(phone))
          ]),
          span('.c-textfield__label', 'Phone')
        ]),
        _makeErrDiv('phone', '.c-textfield__error.c-textfield__error--phone')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--birthday',
              makeInputProps(birthday))
          ]),
          span('.c-textfield__label', 'Birthday')
        ]),
        _makeErrDiv('birthday', '.c-textfield__error.c-textfield__error--birthday')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--zip-code',
              makeInputProps(zipCode))
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
                makeInputProps(answer))
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

  return [
    div('.c-application__teams-title', 'Select a team'),
    ul('.c-application__teams-list',
      mapIndexed((teamKey: string, index: Number) => {
        const { description, name, question } = dbTeams[teamKey];
        const { alreadyFilledIn, answer } = teams[teamKey];

        return void 0,
          li('.c-application__list-item', [
            span('.c-icon__visited', alreadyFilledIn ? `o` : 'x'),
            div('.c-application__teams-div', { attrs: { 'data-index': index } }, `${name}`),
          ])
      }, teamKeys)
    ),
    ul('.c-application__teams-details', [
      li('.c-application__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--teams', `Continue`),
      ]),
    ])
  ]
}

function renderApplicationProcessReview(model: UserApplicationModel): any {
  void model;
  // TODO
}

function renderApplicationProcessStep(step: Step, model: UserApplicationModelNotNull) {
  switch (step) {
    case STEP_ABOUT :
      return renderApplicationProcessAbout(model);
    case STEP_QUESTION :
      return renderApplicationProcessQuestion(model);
    case STEP_TEAMS :
      return renderApplicationProcessTeams(model);
    case STEP_REVIEW :
      return renderApplicationProcessReview(model);
    default:
      throw 'internal error : unexpected step in the application process!'
    // break;
  }
}

function renderApplicationProcessTabs(step: Step) {
  return div('.c-application__progress-bar', map((_step: Step) => {
    return _step !== step
      ? a('.c-application__selected-step', { props: { href: `/${_step}` } }, _step)
      : div('.c-application__unselected-step', _step)
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
  console.info(`entering ${state}`);

  return {
    dom: just(render(model))
  }
}
export const renderComponent = curry(_renderComponent);



