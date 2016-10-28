import {
  AuthenticationInput,
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import {AuthenticationState} from './types'
import {merge as mergeM, Stream} from 'most';
import hold from '@most/hold';
import {
  Component as IComponent,
  Sources,
  Sinks
} from '../../components/types';
import {VNode, DOMSource} from '@motorcycle/dom';
import {
  merge as mergeR,
  keys,
  map as mapR,
  contains,
  identity,
  all
} from 'ramda';

export * from './types';

// TODO : put the right type here for authentication$
export type ForgotPasswordSinks = Sinks & { DOM: Stream<VNode>, authentication$: Stream<any>, router: Stream<string>}

export type ForgotPasswordSources = Sources & {
  DOM: DOMSource;
  authenticationState$: Stream<AuthenticationState>;
}

function redirectToHome() {
  return '/'
}

function assertHasExpectedSources(expectedSourceNames) {
  return function assertHasExpectedSources(sources) {
    const actualSourceNames = keys(sources);
    const matching = mapR((sinkName => contains(sinkName, actualSourceNames)), expectedSourceNames);

    const assertionValue = all(identity, matching);
    if (!assertionValue) {
      throw 'assertHasExpectedSources : could not find all mandatory sources!'
    }

    return true;
  }
}

function computeForgotPasswordSinks(sources, childSinks) {
  const {cancel$, sendEmail$}= childSinks

  return {
    DOM: childSinks.DOM,
    authentication$: sendEmail$
      .tap(function (x) {
        console.warn('authentication', x)
      })
      //      .startWith({method: GET_REDIRECT_RESULT})
      .multicast(),
    router: cancel$
      .tap(function (x) {
        console.warn('intercepting route', x)
      }),
  }
}

function ForgotPasswordActions(specs, [childComponent]) {
  return function ForgotPasswordActions(sources: ForgotPasswordSources): ForgotPasswordSinks {
    // check that pre-conditions are met (NOTE: will throw if not, so no
    // return value)
    specs.preConditions && specs.preConditions(sources);
    // compute the extra sources which are inputs to the children components
    const fetchedSources = specs.fetch && specs.fetch(sources);
    const extendedSources = mergeR(sources, fetchedSources || {});

    // compute the children sinks
    const childrenSinks = childComponent(extendedSources);

    // compute the final component sinks
    return specs.merge(sources, childrenSinks);
  }
}

export {
  assertHasExpectedSources,
  computeForgotPasswordSinks,
  ForgotPasswordActions,
}
