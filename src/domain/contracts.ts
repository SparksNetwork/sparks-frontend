import { allPass, flip, contains, values, isNil, complement, both } from 'ramda';
import { UserApplication, applicationProcessSteps } from '../types/processApplication';
import { isStrictRecord, isString, isHashMap, isBoolean } from '../utils/utils';
import { isNumber } from 'util';

export const isApplicationAboutYouInfo = isStrictRecord({
  superPower: isString
})

export const isPhoneNumber = isString;
export const isDatePickerInfo = isString;
export const isZipCode = isString;

export const isApplicationPersonalInfo = isStrictRecord({
  legalName: isString,
  preferredName: isString,
  phone: isPhoneNumber,
  birthday: isDatePickerInfo,
  zipCode: isZipCode
});

export const isApplicationAboutInfo = isStrictRecord({
  aboutYou: isApplicationAboutYouInfo,
  personal: isApplicationPersonalInfo
});

export const isApplicationQuestionInfo = isStrictRecord({
  answer: isString
});

export const isApplicationTeamInfo = isStrictRecord({
  answer: isString,
  hasBeenJoined: isBoolean
});

export const isTeamsInfo = isHashMap(isString, isApplicationTeamInfo)

export const isStep = flip(contains)(values(applicationProcessSteps));

export const isProgressInfo = isStrictRecord({
  step: isStep,
  hasApplied: isBoolean,
  hasReviewedApplication: isBoolean,
  latestTeamIndex: isNumber
});

export const isValidUserApplication = isStrictRecord({
  userKey: both(isString, complement(isNil)),
  opportunityKey: both(isString, complement(isNil)),
  about: isApplicationAboutInfo,
  questions: isApplicationQuestionInfo,
  teams: isTeamsInfo,
  progress: isProgressInfo
});

export const checkUserApplicationContracts = allPass([
  isValidUserApplication,
]);

