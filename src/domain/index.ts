import { Repository, Context, ContextCommandMap, ContextMap, Params } from '../types/repository';
import { defaultTo } from 'ramda';
import { getFirebaseStream } from '../utils/firebase';

const OPPORTUNITY = 'OPPORTUNITY';
const USER_APPLICATION = 'USERAPP';
const OPPORTUNITY_REF = 'Opportunity';
const USER_APPLICATION_REF = 'UserApplication';

export const queryConfig: ContextMap = {
  [OPPORTUNITY]: function getOpportunityData(fbDb: Repository, context: Context, params: Params) {
    void context;
    const refMap = { [OPPORTUNITY]: OPPORTUNITY_REF };
    const eventName = defaultTo('value')(params.eventName);
    const ref = refMap[OPPORTUNITY];

    return getFirebaseStream(fbDb, eventName, ref);
  },
  [USER_APPLICATION]: function getUserApplicationData(fbDb: Repository, context: Context, params: Params) {
    // NOTE : user might apply to several opportunities
    // Hence a mechanism to filter by opportunity might be needed
    void context;
    const refMap = { [USER_APPLICATION]: USER_APPLICATION_REF };
    const eventName = defaultTo('value')(params.eventName);
    const collectionRef = refMap[USER_APPLICATION];
    const opportunity = defaultTo('')(params.opportunity);
    const ref = [collectionRef, opportunity].join('/');

    return getFirebaseStream(fbDb, eventName, ref);
  }
};

export const domainActionConfig: ContextCommandMap = {
  // TODO
};

