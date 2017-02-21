import { HashMap } from '../../types/repository';
import { ValidationResult } from '../../types/processApplication';
import { pipe, curry, isEmpty, cond, T, gt, length, mapObjIndexed } from 'ramda';

//////
// Form data validation
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
