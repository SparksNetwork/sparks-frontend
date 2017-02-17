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
      progress: { step: '', hasApplied: false, latestTeam: '' },
      teams: {}
    },
    errorMessage: null,
    validationMessages : {}
  }
}

// TODO : also beware that the responses wont be caught as they come with .getResponse...
// find a workaround
// TODO : also investiate I don't need a token if I keep the request, comparison with == should
// suffice
// TODO : think about what happen when in state team detail, not handled for now... extra arrow
// in graph? I guess so, and use lastTeam as info
// TODO : should have the model reflect the GUI state as a fallback to the remote repository

const fsmComponent = makeFSM(events, transitions, entryComponents, fsmSettings);

// Note : in the case of a rounting, ProcessApplication will be called with the keys in setting
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
  console.warn('ProcessApplication', sinks);

// TODO
  return {
    dom: sinks.dom,
    router: sinks.router || never(),
    authentication$: sinks.authentication$ || never(),
    domainAction$: sinks.domainAction$ || never()
  };
}

// TODO : in User application domain, object is userapps:{users:{key:{opps:{key:{::UserApplication}
//   so from the url get user key and opp key, and from that get the user application
// WRITE : I will be writing to that
// Read : same
// !! how to get the team info from Opps and user key

// basically get the project key from the opps and then all the teams and filter by project key
// UserApplication = f(User, Opps, Teams) = Model
// So event data init will be {User, Opps, Teams} then update model will the makeup
// for UserApplication init, which will also be model init
