import { Repository, Context, ContextCommandMap, ContextMap, Params } from '../types/repository';
import { defaultTo } from 'ramda';
import { getFirebaseStream } from '../utils/firebase';

export const OPPORTUNITY = 'OPPORTUNITY';
export const USER_APPLICATION = 'USERAPP';
export const OPPORTUNITY_REF = 'Opportunities';
export const USER_APPLICATION_REF = 'UserApplication';
export const ADD = 'Add';

export const queryConfig: ContextMap = {
  [OPPORTUNITY]: function getOpportunityData(fbDb: Repository, context: Context, params: Params) {
    void context;
    const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const ref = refMap[OPPORTUNITY];

    return getFirebaseStream(fbDb, eventName, ref);
  },
  [USER_APPLICATION]: function getUserApplicationData(fbDb: Repository, context: Context, params: Params) {
    void context;
    const refMap = { [USER_APPLICATION]: USER_APPLICATION_REF };
    const eventName = defaultTo('value')(params && params.eventName);
    const collectionRef = refMap[USER_APPLICATION];
    const opportunity = defaultTo('')(params && params.opportunity);
    const ref = [collectionRef, opportunity].join('/');

    return getFirebaseStream(fbDb, eventName, ref);
  }
};

export const domainActionConfig: ContextCommandMap = {
  [OPPORTUNITY]: {
    [ADD]: function addOpportunity(fbDb: Repository, context: Context, params: Params) {
      void context;

      // Check command contracts
      if (!params || !params.opportunity) {
        throw 'addOpportunity: Cannot add an empty opportunity!'
      }

      const { opportunity, data }= params;
      const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
      const collectionRef = refMap[OPPORTUNITY];
      const ref = [collectionRef, opportunity].join('/');

      console.log('addOpportunity', context, params, ref);

      return fbDb.ref(ref).set(data);
    }
  }
};

