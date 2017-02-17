import { div, input, form, label, ul, li, span, button } from '@motorcycle/dom';
import { just } from 'most';
import { pipe, curry, isEmpty, cond, T, gt, length, mapObjIndexed, map } from 'ramda';
import {
  applicationProcessSteps, Step, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS, STEP_REVIEW,
  ValidationResult, UserApplicationModel, UserApplicationModelNotNull
} from '../../types/processApplication';
import { HashMap } from '../../types/repository';
import { getInputValue } from '../../utils/dom';
import { isBoolean } from '../../utils/utils';

const FIELD_MIN_LENGTH = 2;

function pleaseFillFieldIn() {
  return `Mandatory field : please fill in !`
}

function pleaseMinLength() {
  return `Please fill field with at least ${FIELD_MIN_LENGTH} characters!`
}

// Helper functions
function _validateAboutScreenFields(validationSpecs: HashMap<Function>,
                                    formData: any): ValidationResult {
  return mapObjIndexed((value, key) => validationSpecs[key](value))(formData)
}
export const validateAboutScreenFields = curry(_validateAboutScreenFields);

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
      props: {
        type: 'text',
        required: false,
      }
    }
}

function _makeErrDiv(validationResult: ValidationResult, prop: string, selector: string) {
  console.log('makeErrDiv', validationResult, prop, selector);
  const isValidatedOrError = validationResult[prop];

  return isBoolean(isValidatedOrError)
    ? (
      isValidatedOrError
        ? null : div(selector, isValidatedOrError)
    )
    : div(selector, isValidatedOrError);
}

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

  console.log('data', superPower, legalName, preferredName, phone, birthday, zipCode);
  console.log('validation', model.validationMessages);

  const makeErrDiv = curry(_makeErrDiv)(model.validationMessages);

  console.log('testing err div', makeErrDiv('superPower', '.c-textfield__error..c-textfield__error--super-power'))

  return [
    ul('.c-application__about', [
        li('.c-application__list-item', [
          div('.c-application__about-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--super-power',
                makeProps(superPower))
            ]),
            span('.c-textfield__label', 'About you')
          ]),
          makeErrDiv('superPower', '.c-textfield__error..c-textfield__error--super-power')
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
        makeErrDiv('legalName', '.c-textfield__error..c-textfield__error--legal-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--preferred-name',
              makeProps(preferredName))
          ]),
          span('.c-textfield__label', 'Preferred name')
        ]),
        makeErrDiv('preferredName', '.c-textfield__error..c-textfield__error--preferred-name')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--phone',
              makeProps(phone))
          ]),
          span('.c-textfield__label', 'Phone')
        ]),
        makeErrDiv('phone', '.c-textfield__error..c-textfield__error--phone')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--birthday',
              makeProps(birthday))
          ]),
          span('.c-textfield__label', 'Birthday')
        ]),
        makeErrDiv('birthday', '.c-textfield__error..c-textfield__error--birthday')
      ]),
      li('.c-application__list-item', [
        div('.c-application__personal-div.c-textfield', [
          label([
            input('.c-textfield__input.c-textfield__input--zip-code',
              makeProps(zipCode))
          ]),
          span('.c-textfield__label', 'Zip code')
        ]),
        makeErrDiv('zipCode', '.c-textfield__error..c-textfield__error--zip-code')
      ]),
    ]),
    ul('.c-application__personal-details', [
      li('.c-sign-in__list-item', [
        button('.c-btn.c-btn--primary.c-application__submit--about', `Continue`),
      ]),
    ]),
  ]
}

function renderApplicationProcessQuestion(model: UserApplicationModel): any {
  void model;
  // TODO
}

function renderApplicationProcessTeams(model: UserApplicationModel): any {
  void model;
  // TODO
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
      div('.c-application__progress-bar',
        map((_step: Step) => {
          // put the link where it should be, i.e. cf. progress.step
          _step === step
            ? div('.c-application__selected-step', step)
            : div('.c-application__unselected-step', step)
        }, applicationProcessSteps)
      ),
      form('.c-application__form', renderApplicationProcessStep(step, model)),
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


// TODO : put the validation in a guard, if not valid re-enter the state, hence next state
// TODO : That means I need to implement FSM with state re-entry with re-exec or do nothing options
export function aboutComponent(sources: any, settings: any) {
  // in charge of displaying About step screen and implementing the behaviour
  // 1. View
  //   - every field has to pass validation
  //   - if all validation are successful -> display all fields and button disabled (processing...)
  //   - else -> display error message below corresponding field, continue button disabled
  // 2. FSM :
  //   - Continue click && validated =>
  //     - action request : save data in repository
  //     - transition when acknowledgement of ok saved

  void sources;
  const model: UserApplicationModelNotNull = settings.model;
  console.log('entering aboutComponent', model);

  return {
    // TODO : beware this FILE should be only for About, it seems to be for all?? I mean the render
    // sources.domainAction$.getResponse(OPPORTUNITY)
    // TODO : case I reenter about component, I should see what is in the database, and if
    // nothing, what is in the modelxAbout, and if nothing then nothing, and then on each click
    // update, so not just(render(MODEL but query%... | model | ''
    dom: just(render(model))
  }
}

