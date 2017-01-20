import { Repository, Context, ContextCommandMap, ContextMap, Params } from '../types/repository';
import { defaultTo } from 'ramda';
import { getFirebaseStream } from '../utils/firebase';

export const OPPORTUNITY = 'OPPORTUNITY';
export const USER_APPLICATION = 'USERAPP';
export const TEAMS = 'TEAMS';
export const USERS = 'USERS';
export const OPPORTUNITY_REF = 'Opps';
export const USER_APPLICATION_REF = 'UserApplication';
export const TEAMS_REF = 'Teams';
export const USERS_REF = 'Users';
export const ADD = 'Add';

export const queryConfig: ContextMap = {
  [OPPORTUNITY]: function getOpportunityData(fbDb: Repository, context: Context, params: Params) {
    void context;
    const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const opportunityKey = defaultTo('')(params && params.opportunityKey);
    const collectionRef = refMap[OPPORTUNITY];
    const ref = [collectionRef, opportunityKey].join('/');

    return getFirebaseStream(fbDb, eventName, ref);
  },
  [USER_APPLICATION]: function getUserApplicationData(fbDb: Repository, context: Context, params: Params) {
    // TODO : analyse what happens in case of error
    // TODO : improve code for when there is no oppKey nor userKey -> ref//!
    // TODO : typescript type for params subtype of any
    // i.e. Applications/Users/key/Opportunities/key
    void context;
    const refMap = { [USER_APPLICATION]: USER_APPLICATION_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const collectionRef = refMap[USER_APPLICATION];
    const opportunityKey = defaultTo('')(params && params.opportunityKey);
    const userKey = defaultTo('')(params && params.userKey);
    const ref = [collectionRef, USERS_REF, userKey, OPPORTUNITY_REF, opportunityKey].join('/');

    return getFirebaseStream(fbDb, eventName, ref);
  },
  [TEAMS]: function getTeamsData(fbDb: Repository, context: Context, params: Params) {
    void context;
    const refMap = { [TEAMS]: TEAMS_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const ref = refMap[TEAMS];

    return getFirebaseStream(fbDb, eventName, ref);
  },
};

export const domainActionConfig: ContextCommandMap = {
  [OPPORTUNITY]: {
    [ADD]: function addOpportunity(fbDb: Repository, context: Context, params: Params) {
      void context;

      // Check command contracts
      if (!params || !params.opportunity) {
        throw 'addOpportunity: Cannot add an empty opportunity!'
      }

      const { opportunity, data } = params;
      const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
      const collectionRef = refMap[OPPORTUNITY];
      const ref = [collectionRef, opportunity].join('/');

      console.log('addOpportunity', context, params, ref);

      return fbDb.ref(ref).set(data);
    }
  }
};
