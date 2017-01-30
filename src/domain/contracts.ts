import { UserApplication } from '../types/processApplication';

export function isValidUserApplicationPK (userApplication : UserApplication){
  return userApplication.userKey && userApplication.opportunityKey
}

export const checkUserApplicationContracts = isValidUserApplicationPK;
