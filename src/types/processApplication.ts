export interface UserApplication {
  user: string,
  opportunity: string,
  about: ApplicationAboutInfo,
  questions: ApplicationQuestionInfo,
  teams: TeamInfo,
  progress: Progress
}

export type PhoneNumber = string;
export type ZipCode = string;
export type DatePickerInfo = string;

export interface ApplicationAboutYouInfo {
  superPower: string
}

export interface ApplicationPersonalInfo {
  legalName: string,
  preferredName: string,
  phone: PhoneNumber,
  birthday: DatePickerInfo,
  zipCode: ZipCode
}

export interface ApplicationAboutInfo {
  aboutYou: ApplicationAboutYouInfo,
  personal: ApplicationPersonalInfo
}

export interface ApplicationQuestionInfo {
  answer: string
}

export interface TeamInfo {

}

export type Step = string; // actually should be an enum
export interface Progress {
  step: Step,
  hasApplied: boolean,
  latestTeam: string
}

export const STEP_ABOUT = 'about';
export const STEP_QUESTION = 'question';
export const STEP_TEAMS = 'teams';
export const STEP_REVIEW = 'review';
// TODO: a step TEAM_DETAIL or not?
