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

// TODO : also beware that the responses wont be caught as they come with .getResponse...
// find a workaround
// TODO : 6. FSM re_entry should be lower, at action guard level when I put the target state
// TODO : 5. error message when the model is corrupted - missing field etc.
// TODO : 4. add a button unjoin team - could be same button Join/Unjoin is not joined or joined
// TODO : 1. investigate bug with skip and join button => send issues to snadbomm github
// TODO : 6. write a monad which allow to chain model update (in FSM/utils lib or index)
// TODO : 3. add events for each input field to adjust the model and redraw to avoid 1.
// TODO : 3. factor it so that each input is just calling a factored function with parameters
// TODO : 2. think about facilities for testing the FSM! try to test with it
// TODO : 1. put better CSS as much as possible to make it look good

// ---> the usual one, but move document.getElementById to sources.DOM, and create a mockDom when
// testing

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
