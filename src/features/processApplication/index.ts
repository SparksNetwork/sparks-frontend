// NOTE
// dump staging
// https://sparks-staging-v3.firebaseio.com/.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// dump Opps reference
// https://sparks-staging-v3.firebaseio.com/Opps.json?print=pretty&auth=rwjUlSb4haFyYgkA3h5kL1LUG81qIr7RvAPvXm1f
// auth token here is in settings, service account, database secret
import { never } from 'most';
import { MainSinks, MainSources } from '../../app';
import { makeFSM } from '../../components/FSM';
import { Project } from '../../types/domain';
import { UserApplicationModel } from '../../types/processApplication';
import { events, transitions, entryComponents, fsmSettings } from './processApplicationFsmDef';

function getEmptyProject(): Project {
  return {
    name: '',
    description: '',
    ownerProfileKey: ''
  }
}

function getEmptyUserApplicationModel(): UserApplicationModel {
  return {
    user: null, // will have to be filled down the road
    opportunity: {
      description: '',
      authorProfilekey: '',
      isPublic: true,
      name: '',
      project: getEmptyProject(),
      projectKey: '',
      question: '',
      confirmationsOn: false
    },
    teams: {},
    userApplication: {
      opportunityKey: '', userKey: '',
      about: {
        aboutYou: { superPower: '' },
        personal: { legalName: '', preferredName: '', phone: '', zipCode: '', birthday: '' }
      },
      questions: { answer: '' },
      progress: { step: '', hasApplied: false, hasReviewedApplication: false, latestTeamIndex: 0 },
      teams: {}
    },
    errorMessage: null,
    validationMessages : {}
  }
}

// TODO : 3. but even better is to have the firebase update be an update not a set operation!!
// this means less traffic towards the server
// TODO : 4. remove the unused field in progress or what is teams? remove alreadyFilledIn id never used
// fixme : 1. investigate bug with skip and join button => happens once then not when refresh

const fsmComponent = makeFSM(events, transitions, entryComponents, fsmSettings);

// Note : in the case of a routing, ProcessApplication will be called with the keys in setting
export function ProcessApplication(sources: MainSources): MainSinks {
  const emptyUserApplicationModel = getEmptyUserApplicationModel();
  const fakeOpportunityKey = '-KEMfQuSuMoabBEy9Sdb';
  const fakeUserKey = 'facebook:10209589368915969';
  if (!emptyUserApplicationModel.userApplication) {
    throw 'Internal error'
  } // ts forces my hand

  emptyUserApplicationModel.userApplication.opportunityKey = fakeOpportunityKey;
  emptyUserApplicationModel.userApplication.userKey = fakeUserKey;

  const sinks = fsmComponent(sources, {
    model: emptyUserApplicationModel,
    userKey: fakeUserKey,
    opportunityKey: fakeOpportunityKey
  });

// TODO : to finish when specs evolves (for instance, routing specs, where next to apply?)
  return {
    dom: sinks.dom,
    router: sinks.router || never(),
    authentication$: sinks.authentication$ || never(),
    domainAction$: sinks.domainAction$ || never()
  };
}
