import { div, input, form, label, ul, li, span, button } from '@motorcycle/dom';
import { Stream, combineArray, concat, just } from 'most';
import hold from '@most/hold';
import {
  pipe, curry, zipObj, isEmpty, cond, T, gt, length, mapObjIndexed, values, keys, map, isNil
} from 'ramda';
import {
  AboutStateRecord$, applicationProcessSteps, Step, STEP_ABOUT, STEP_QUESTION, STEP_TEAMS,
  STEP_REVIEW, UserApplication
} from '../../types/processApplication';
import { HashMap } from '../../types/repository';

const FIELD_MIN_LENGTH = 2;

function preventDefault(ev: any) {
  ev.preventDefault();
}

function pleaseFillFieldIn() {
  return `Mandatory field : please fill in !`
}

function pleaseMinLength() {
  return `Please fill field with at least ${FIELD_MIN_LENGTH} characters!`
}

function validateAboutScreenFields(validationSpecs: HashMap<Function>,
                                   stream: Stream<any>): Stream<HashMap<boolean|string>> {
  return stream.map(mapObjIndexed((value, key) => validationSpecs[key](value)))
}

export function aboutComponent(sources: any, settings: any) {
  // in charge of displaying About step screen and implementing the behaviour
  // 1. View
  //   - every field has to pass validation
  //   - if all validation are successful -> display all fields and button disabled (processing...)
  //   - else -> display error message below corresponding field, continue button disabled
  //   That means having a state property which is
  //   - validated : boolean
  //   - errors : Array<FieldValidation>, FieldValidation :: String ('' if ok)
  //   - model
  // 2. FSM :
  //   - Continue click && validated =>
  //     - action request : save data in repository
  //     - transition when acknowledgement of ok saved

  const { dom } = sources;
  const model = settings.model;
  const { opportunity, userApplication } = model;
  const { description } = opportunity;
  const {
          about : {
            aboutYou : { superPower },
            personal:{ legalName, preferredName, phone, zipCode, birthday }
          },
          questions:{ answer },
          teams,
          progress : { step, hasApplied, latestTeam }
        } = userApplication as UserApplication;
  void answer, hasApplied, teams, latestTeam, latestTeam, description, step;

  const events = {
    continueButtonClick: dom.select('form.c-application__form').events('submit'),
    aboutYouFieldInput: dom.select('.c-textfield__input--super-power').events('input'),
    legalNameFieldInput: dom.select('.c-textfield__input--legal-name').events('input'),
    preferredNameFieldInput: dom.select('.c-textfield__input--preferred-name').events('input'),
    phoneFieldInput: dom.select('.c-textfield__input--phone').events('input'),
    birthdayFieldInput: dom.select('.c-textfield__input--birthday').events('input'),
    zipCodeFieldInput: dom.select('.c-textfield__input--zip-code').events('input'),
  };

  const intents = {
    continueToNext: events.continueButtonClick
  };

  const state: AboutStateRecord$ = {
    superPower: events.aboutYouFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(superPower)
      // hold is in fact not necessary because sampleWith is already memoizing
      // we keep it for conceptual consistency (state is composed of behaviors)
      .thru(hold),
    legalName: events.legalNameFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(legalName)
      .thru(hold),
    preferredName: events.preferredNameFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(preferredName)
      .thru(hold),
    phone: events.phoneFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(phone)
      .thru(hold),
    birthday: events.birthdayFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(birthday)
      .thru(hold),
    zipCode: events.zipCodeFieldInput
      .map((ev: any) => (ev.target as HTMLInputElement).value)
      .startWith(zipCode)
      .thru(hold),
  };

  const validateSuperPower = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
  const validateLegalName = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
  const validatePreferredName = cond([[isEmpty, pleaseFillFieldIn], [T, T]]);
  const validatePhone = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);
  const validateBirthday = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);
  const validateZipCode = cond([[pipe(length, gt(FIELD_MIN_LENGTH)), pleaseMinLength], [T, T]]);

  const aboutScreenFieldValidationSpecs = {
    'superPower': validateSuperPower,
    'legalName': validateLegalName,
    'preferredName': validatePreferredName,
    'phone': validatePhone,
    'birthday': validateBirthday,
    'zipCode': validateZipCode
  };

  function getCombinedStateStream(state: AboutStateRecord$) {
    return combineArray(
      zipObj(keys(aboutScreenFieldValidationSpecs)),
      values(state) as Array<Stream<string>> // bug in ts? does not understand the type well
    ) as any
  }

  const actions = {
    validateFormOnClick: getCombinedStateStream(state)
      .tap(console.log.bind(console, 'validateFormOnClick'))
      .sampleWith(intents.continueToNext.tap(preventDefault))
      .thru(curry(validateAboutScreenFields)(aboutScreenFieldValidationSpecs))
      .multicast(),
  };

  function renderApplicationProcessAbout(model: UserApplication | null, validationResult: any) {
    // TODO : add the validation results error messages
    const initialRendering = isNil(model);
    let superPower, legalName, preferredName, phone, birthday, zipCode;

    if (initialRendering) {
      ({
        about: {
          aboutYou: superPower,
          personal: {
            legalName, preferredName, phone, birthday, zipCode
          }
        },
      } = model as UserApplication);
    }

    function makeProps(initialRendering: boolean, fieldValue: any) {
      return initialRendering
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

    return [
      ul('.c-application__about', [
          li('.c-application__list-item', [
            div('.c-application__about-div.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--super-power',
                  makeProps(initialRendering, superPower))
              ]),
              span('.c-textfield__label', 'About you')
            ]),
          ]),
        ]
      ),
      ul('.c-application__personal-details', [
        li('.c-application__list-item', [
          div('.c-application__personal-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--legal-name',
                makeProps(initialRendering, legalName))
            ]),
            span('.c-textfield__label', 'Legal name')
          ]),
        ]),
        li('.c-application__list-item', [
          div('.c-application__personal-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--preferred-name',
                makeProps(initialRendering, preferredName))
            ]),
            span('.c-textfield__label', 'Preferred name')
          ]),
        ]),
        li('.c-application__list-item', [
          div('.c-application__personal-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--phone',
                makeProps(initialRendering, phone))
            ]),
            span('.c-textfield__label', 'Phone')
          ]),
        ]),
        li('.c-application__list-item', [
          div('.c-application__personal-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--birthday',
                makeProps(initialRendering, birthday))
            ]),
            span('.c-textfield__label', 'Birthday')
          ]),
        ]),
        li('.c-application__list-item', [
          div('.c-application__personal-div.c-textfield', [
            label([
              input('.c-textfield__input.c-textfield__input--zip-code',
                makeProps(initialRendering, zipCode))
            ]),
            span('.c-textfield__label', 'Zip code')
          ]),
        ]),
      ]),
      ul('.c-application__personal-details', [
        li('.c-sign-in__list-item', [
          button('.c-btn.c-btn--primary.c-application__submit--about', `Continue`),
        ]),
      ]),
    ]
  }

  function renderApplicationProcessQuestion(model: UserApplication): any {
    void model;
    // TODO
  }

  function renderApplicationProcessTeams(model: UserApplication): any {
    void model;
    // TODO
  }

  function renderApplicationProcessReview(model: UserApplication): any {
    void model;
    // TODO
  }

  function renderApplicationProcessStep(step: Step, model: UserApplication, validationResult: any) {
    switch (step) {
      case STEP_ABOUT :
        // TODO : think about which parameter to pass to this function, must work with Initial
        // and later
        return renderApplicationProcessAbout(model, validationResult);
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

  function renderInitialView(model: any, validationResult) {
    const { opportunity, userApplication } = model;
    const { description } = opportunity;
    const { about, questions, teams, progress } = userApplication;
    const { step, hasApplied, latestTeam } = progress;
    void about, questions, teams, hasApplied, latestTeam;

    // TODO: factor the part of the views in common with `render`
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
        form('.c-application__form', renderApplicationProcessStep(step, model, validationResult))
      ]),
    ]);
  }

  const validationResults = actions.validateFormOnClick;

  return {
    // sources.domainAction$.getResponse(OPPORTUNITY)
    // TODO : arrange types but should be something like that
    dom: concat(just(renderInitialView(model)), validationResults.map(render))
    // NOTE : no domainAction here, that's done by the state machine as part of the transition
  }
}

