export interface UserApplication {
  userKey: string,
  opportunityKey: string,
  about: ApplicationAboutInfo,
  questions: ApplicationQuestionInfo,
  teams: TeamsInfo,
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

export interface TeamsInfo {
  [teamKey: string]: ApplicationTeamInfo
}

export interface ApplicationTeamInfo {
  answer: string;
  alreadyVisited: boolean
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
