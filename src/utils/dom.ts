import { ValidationResult } from '../types/processApplication';
import { curry, isEmpty } from 'ramda';
import { isBoolean } from './utils';
import { div } from '@motorcycle/dom';

export function getInputValue(sel: string) {
  const el = document.querySelector(sel) as HTMLInputElement;
  return el ? el.value : ''
}

export function makeInputProps(fieldValue: any, latestTeamIndex: any) {
  // NOTE!!!! The key MUST be passed to indicate to the virtual node library that those node are
  // indeed different
  return {
    key: latestTeamIndex,
    props: {
      value: fieldValue ? fieldValue : '',
      type: 'text',
      required: false,
    }
  }
}

function _makeErrDiv(validationResult: ValidationResult, prop: string, selector: string) {
  const isValidatedOrError = validationResult[prop];

  return isBoolean(isValidatedOrError) || isEmpty(isValidatedOrError)
    ? (
      isValidatedOrError
        ? div(selector, '') : div(selector, isValidatedOrError)
    )
    : div(selector, isValidatedOrError);
}
export const makeErrDiv = curry(_makeErrDiv);
