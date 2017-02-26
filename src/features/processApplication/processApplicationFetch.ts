import { getInputValue } from '../../utils/dom';
import { USER_APPLICATION, TEAMS, OPPORTUNITY } from '../../domain/index';
import { combineArray, Stream } from 'most';
import { FirebaseUserChange } from '../../drivers/firebase-user/index';
import { Opportunity, Teams } from '../../types/domain';
import { UserApplication } from '../../types/processApplication';

//////
// Form data fetching
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

export function getTeamDetailFormData(_?: any) {
  return {
    'answer': getInputValue('.c-textfield__input--team_detail_answer'),
  }
}

//////
// Remote repository data fetching
export function fetchUserApplicationData(sources: any, opportunityKey: string, userKey: string) {
  return sources.query$.query(USER_APPLICATION, { opportunityKey, userKey })
    .tap(console.warn.bind(console, 'USER_APPLICATION fetch event'));
}

export function fetchUserApplicationModelData(sources: any, settings: any) {
  const { user$ } = sources;
  const { opportunityKey, userKey } = settings;
  const userApp$ = fetchUserApplicationData(sources, opportunityKey, userKey);
  const teams$ = sources.query$.query(TEAMS, {});
  const opportunities$: Stream<Opportunity> = sources.query$.query(OPPORTUNITY, { opportunityKey });

  // NOTE : combineArray will produce its first value when all its dependent streams have
  // produced their first value. Hence this is equivalent to a zip for the first value, which
  // is the only one we need anyways (there is no zipArray in most)
  return combineArray<FirebaseUserChange, Opportunity | null, UserApplication | null, Teams | null, any>(
    (user, opportunity, userApplication, teams) =>
      ({
        user,
        opportunity,
        userApplication,
        teams,
        errorMessage: null,
        validationMessages: {}
      }),
    [user$, opportunities$, userApp$, teams$]
  )
    .tap(console.warn.bind(console, 'combined user, userapp, teams fetch event'))
    .take(1)
}
