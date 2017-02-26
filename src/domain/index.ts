import { Repository, Context, ContextCommandMap, ContextMap, Payload } from '../types/repository';
import { defaultTo } from 'ramda';
import { getFirebaseStream } from '../utils/firebase';
import { UserApplication } from '../types/processApplication';
import { assertContract } from '../utils/utils';
import { checkUserApplicationContracts } from './contracts';
// TODO : those contracts should be in the domain???

export const OPPORTUNITY = 'OPPORTUNITY';
export const USER_APPLICATION = 'USERAPP';
export const TEAMS = 'TEAMS';
export const USERS = 'USERS';
export const OPPORTUNITY_REF = 'Opps';
export const USER_APPLICATION_REF = 'UserApplications';
export const TEAMS_REF = 'Teams';
export const USERS_REF = 'Users';
export const ADD = 'Add';
export const UPDATE = 'Update';

export const queryConfig: ContextMap = {
  [OPPORTUNITY]: function getOpportunityData(fbDb: Repository, context: Context, params: Payload) {
    void context;
    const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const opportunityKey = defaultTo('')(params && params.opportunityKey);
    const collectionRef = refMap[OPPORTUNITY];
    const ref = [collectionRef, opportunityKey].join('/');

    return getFirebaseStream(fbDb, eventName, ref);
  },
  [USER_APPLICATION]: function getUserApplicationData(fbDb: Repository, context: Context, params: Payload) {
    // TODO : analyse what happens in case of error
    // TODO : improve code for when there is no oppKey nor userKey -> ref//!
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
  [TEAMS]: function getTeamsData(fbDb: Repository, context: Context, params: Payload) {
    void context;
    const refMap = { [TEAMS]: TEAMS_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const ref = refMap[TEAMS];

    return getFirebaseStream(fbDb, eventName, ref);
  },
};

export const domainActionConfig: ContextCommandMap = {
  [OPPORTUNITY]: {
    [ADD]: function addOpportunity(fbDb: Repository, context: Context, params: Payload) {
      void context;
      // TODO : acthung might be opportunityKey?!
      // TODO : Can remove : not used now
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
  },
  [USER_APPLICATION]: {
    // TODO : create userApp obj if not exists, else update it, so we need a key here to identify
    // No, might not need a key. It is at userapps/users/userkey/opps/oppkey
    // so make sure payload is UserApplication
    //
    [UPDATE]: function updateUserApplication(fbDb: Repository,
                                             context: Context,
                                             payload: UserApplication) {
      void context;

      // Check command contracts
      assertContract(checkUserApplicationContracts, [payload],
        `UserApplication's user and opportunity keys cannot be null!`);

      const { userKey, opportunityKey, } = payload;
      const refMap = { [USER_APPLICATION]: USER_APPLICATION_REF };
      const collectionRef = refMap[USER_APPLICATION];
      const ref = [collectionRef, USERS_REF, userKey, OPPORTUNITY_REF, opportunityKey].join('/');

      console.log('update user application:', context, ref, payload);

      return fbDb.ref(ref).set(payload);
    }
  },
};
