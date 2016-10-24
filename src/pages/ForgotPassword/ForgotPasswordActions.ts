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
import {merge as mergeR} from 'ramda';

export * from './types';

export type ForgotPasswordSinks = Sinks & { DOM: Stream<VNode>, router: Stream<string>}

export type ForgotPasswordSources = Sources & {
  DOM: DOMSource;
  authenticationState$: Stream<AuthenticationState>;
}

function redirectToHome() {
  return '/'
}

function computeForgotPasswordSinks(sources, childSinks) {
  const {cancel$, sendEmail$}= childSinks

  return {
    DOM : childSinks.DOM,
    authentication$: sendEmail$
//      .startWith({method: GET_REDIRECT_RESULT})
      .multicast(),
    router: cancel$.tap(function(x){console.warn('intercepting route', x)}),
  }
}

function ForgotPasswordActions(specs, [childComponent]) {
  return function ForgotPasswordActions(sources: ForgotPasswordSources): ForgotPasswordSinks {
    // compute the extra sources which are inputs to the children components
    const fetchedSources = specs.fetch && specs.fetch(sources)
    const extendedSources = mergeR(sources, fetchedSources || {})

    // compute the children sinks
    const childrenSinks = childComponent(extendedSources)

    // compute the final component sinks
    // TODO : why merge the sources with the sinks??
    return specs.merge(sources, childrenSinks)
  }
}

export {
  computeForgotPasswordSinks,
  ForgotPasswordActions,
}
