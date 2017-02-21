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
import { getInputValue } from '../../utils/dom';
import { isBoolean } from '../../utils/utils';
const format = require('fmt-obj');
const mapIndexed = addIndex(map);

const FIELD_MIN_LENGTH = 2;

function pleaseFillFieldIn() {
  return `Mandatory field : please fill in !`
}

function pleaseMinLength() {
  return `Please fill field with at least ${FIELD_MIN_LENGTH} characters!`
}

// Helper functions
function _validateScreenFields(validationSpecs: HashMap<Function>,
                               formData: any): ValidationResult {
  return mapObjIndexed((value, key) => validationSpecs[key](value))(formData)
}
export const validateScreenFields = curry(_validateScreenFields);

function makeProps(fieldValue: any) {
  return fieldValue
    ? {
      props: {
        value: fieldValue,
        type: 'text',
        required: false,
      }
    }
    : {
      props: {// TODO : doc, this is bug? if I don't put field value, wrong past input value is kept
        value: fieldValue,
        type: 'text',
        required: false,
      }
    }
}

function _makeErrDiv(validationResult: ValidationResult, prop: string, selector: string) {
  const isValidatedOrError = validationResult[prop];

  return isBoolean(isValidatedOrError)
    ? (
      isValidatedOrError
        ? null : div(selector, isValidatedOrError)
    )
    : div(selector, isValidatedOrError);
}
const makeErrDiv = curry(_makeErrDiv);

// About screen validation
const validateSuperPower = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
const validateLegalName = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
const validatePreferredName = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
const validatePhone = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);
const validateBirthday = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);
const validateZipCode = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);

export const aboutScreenFieldValidationSpecs = {
  'superPower': validateSuperPower,
  'legalName': validateLegalName,
  'preferredName': validatePreferredName,
  'phone': validatePhone,
  'birthday': validateBirthday,
  'zipCode': validateZipCode
} as HashMap<any>;

// Question screen validation
const validateAnswer = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);

export const questionScreenFieldValidationSpecs = {
  'answer': validateAnswer
} as HashMap<any>;


// TODO : add render for the links - tab component with parameters and state
//
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

  console.log('testing err div', _makeErrDiv('superPower', '.c-textfield__error..c-textfield__error--super-power'))

  return void 0,
    ul('.c-application__about', [
        li('.c-application__list-item', [
          div('.c-application__about-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--super-power',
                makeProps(superPower))
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
              makeProps(legalName))
          ]),
          span('.c-textfield__label', 'Legal name')
        ]),
        _makeErrDiv('legalName', '.c-textfield__error.c-textfield__error--legal-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--preferred-name',
              makeProps(preferredName))
          ]),
          span('.c-textfield__label', 'Preferred name')
        ]),
        _makeErrDiv('preferredName', '.c-textfield__error.c-textfield__error--preferred-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--phone',
              makeProps(phone))
          ]),
          span('.c-textfield__label', 'Phone')
        ]),
        _makeErrDiv('phone', '.c-textfield__error.c-textfield__error--phone')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--birthday',
              makeProps(birthday))
          ]),
          span('.c-textfield__label', 'Birthday')
        ]),
        _makeErrDiv('birthday', '.c-textfield__error.c-textfield__error--birthday')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--zip-code',
              makeProps(zipCode))
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

  return void 0,
    div('.c-application__question-div.c-title', question),
    ul('.c-application__question', [
        li('.c-application__list-item', [
          div('.c-application__question-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--answer',
                makeProps(answer))
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
}

function renderApplicationProcessTeams(model: UserApplicationModelNotNull): any {
  const { userApplication: { teams } } = model;
  const dbTeams = model.teams;
  const teamKeys = keys(dbTeams);

  return void 0,
    div('.c-application__teams-title', 'Select a team'),
    ul('.c-application__teams-list', flatten([
      mapIndexed((teamKey: string, index: Number) => {
        const { description, name, question } = dbTeams[teamKey];
        const { alreadyFilledIn, answer } = teams[teamKey];

        return void 0,
          li('.c-application__list-item', [
            span('.c-icon__visited', alreadyFilledIn ? `o` : 'x'),
            div('.c-application__teams-div', { attrs: { 'data-index': index } }, [
              span('.c-textfield__label', `${name}`)
            ]),
          ])
      }, teamKeys)
    ])),
    ul('.c-application__teams-details', [
      li('.c-application__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--teams', `Continue`),
      ]),
    ])

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
  const { step, hasApplied, latestTeam } = progress;
  void about, questions, teams, hasApplied, latestTeam;

  return div('#page', [
    div('.c-application', [
      div('.c-application__header', [
        div('.c-application__opportunity-title', description),
        div('.c-application__opportunity-icon', 'icon'),
        div('.c-application__opportunity-location', 'location'),
        div('.c-application__opportunity-date', 'date'),
      ]),
      div('.c-application__title', `Complete your application for ${description}`),
      div('.c-application__progress-bar', [renderApplicationProcessTabs(step)]),
      form('.c-application__form', [renderApplicationProcessStep(step, model)]),
      errorMessage
        ? div('.c-application__error', `An error occurred : ${errorMessage}`)
        : '',
    ]),
  ]);
}

export function getAboutFormData(_?: any) {
  return {
    'superPower': getInputValue('.c-textfield__input--super-power'),
    'legalName': getInputValue('.c-textfield__input--legal-name'),
    'preferredName': getInputValue('.c-textfield__input--preferred-name'),
    'phone': getInputValue('.c-textfield__input--phone'),
    'birthday': getInputValue('.c-textfield__input--birthday'),
    'zipCode': getInputValue('.c-textfield__input--zip-code')
  }
}

export function getQuestionFormData(_?: any) {
  return {
    'answer': getInputValue('.c-textfield__input--answer'),
  }
}

export function aboutComponent(sources: any, settings: any) {
  void sources;
  const model: UserApplicationModelNotNull = settings.model;
  console.info('entering aboutComponent', model);

  return {
    dom: just(render(model))
  }
}

export function questionComponent(sources: any, settings: any) {
  void sources;

  const model: UserApplicationModelNotNull = settings.model;
  console.info('entering questionComponent', model);

  return {
    dom: just(render(model))
  }
}

export function TeamComponent(sources: any, settings: any) {
  void sources;

  const model: UserApplicationModelNotNull = settings.model;
  console.info('entering TeamComponent', model);

  return {
    dom: just(render(model))
  }
}


