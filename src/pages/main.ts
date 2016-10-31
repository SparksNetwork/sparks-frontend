import {FirebaseSource, QueueSink, QueueSource} from '../drivers/cyclic-fire';
import {
  AuthenticationInput,
  AuthenticationOutput,
  AuthenticationError,
} from '../drivers/firebase-authentication';
import {Stream, just} from 'most';
import {VNode, DOMSource} from '@motorcycle/dom';
import {RouterSource} from 'cyclic-router/lib/RouterSource';
import {Sources, Sinks} from '../components/types';
import {merge} from 'ramda';
import hold from '@most/hold';

import Landing from './Landing';
// import Login from './Login';
import LogIn from './_LogIn';
import {ForgotPasswordComponent} from './ForgotPassword';
import {ResetPasswordComponent, ResetPasswordRouteAdapter} from './ResetPassword';
import ComponentRouter from '../components/ComponentRouter';

const routes = {
  '/': Landing,
  //  '/login': Login
  '/login': LogIn,
  // NOTE : would like /auth/resetPassword, but current router does not read
  // params in `?atr=value&atr=value` form
  '/auth/reset/:id': ResetPasswordRouteAdapter(ResetPasswordComponent),
  '/auth/forgotPassword': ForgotPasswordComponent,
};

export interface MainSinks extends Sinks {
  DOM: Stream<VNode>;
  router: Stream<string>;
  authentication$: Stream<AuthenticationInput>;
  queue$: QueueSink;
}

export interface MainSources extends Sources {
  DOM: DOMSource;
  router: RouterSource;
  authentication$: Stream<AuthenticationOutput>;
  firebase: FirebaseSource;
  queue$: QueueSource;
  random: Stream<any>;
}

// TODO : to move in a separate directory
// TODO : TS typings Sources, [Component] -> Sinks
function computeAuhenticationState(sources) {
  return sources.authentication$
  // TODO : update that after ADRs decision on the format of driver output
    .map(authenticationOutput => {
      return {
        isAuthenticated: !!authenticationOutput.userCredential.user,
        authenticationError: authenticationOutput.error as AuthenticationError
      }
    })
    .thru(hold);
}

function InjectSources(injectedSources, [childComponent]) {
  return function (sources) {
    const mergedSources = merge(sources, injectedSources)

    return childComponent(mergedSources)
  }
}

export function main(sources: MainSources): MainSinks {
  const page = InjectSources({
    authenticationState$: computeAuhenticationState(sources),
    routes$: just(routes)
  }, [
    ComponentRouter
  ])(sources);

  return {
    DOM: page.DOM,
    router: page.route$,
    authentication$: page.pluck('authentication$'),
    queue$: page.pluck('queue$'),
    preventDefault: page.pluck('preventDefault'),
  };
}
