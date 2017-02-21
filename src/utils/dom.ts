import { ValidationResult } from '../types/processApplication';
import { curry } from 'ramda';
import { isBoolean } from './utils';
import { div } from '@motorcycle/dom';

export function getInputValue(sel: string) {
  const el = document.querySelector(sel) as HTMLInputElement;
  return el ? el.value : ''
}

export function makeInputProps(fieldValue: any) {
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
export const makeErrDiv = curry(_makeErrDiv);
