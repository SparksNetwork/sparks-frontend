import {FirebaseSource, QueueSink, QueueSource} from '../drivers/cyclic-fire';
import {
  AuthenticationInput,
  AuthenticationOutput,
  AuthenticationError,
} from '../drivers/firebase-authentication';
import {Stream, just, combine} from 'most';
import {VNode, DOMSource} from '@motorcycle/dom';
import {RouterSource} from 'cyclic-router/lib/RouterSource';
import {Sources, Sinks} from '../components/types';
import {merge, always} from 'ramda';
import {InjectSources} from '../higher-order-components/combinators/InjectSources';
import hold from '@most/hold';

import Landing from './Landing';
// import Login from './Login';
import LogIn from './_LogIn';
import {ForgotPasswordComponent} from './ForgotPassword';
import {
  ResetPasswordComponent,
  InjectRouteParams
} from './ResetPassword';
import ComponentRouter from '../components/ComponentRouter';
import {AuthMethods} from "./types/authentication/types"
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE
} from '../pages/config.properties'

const routes = {
  '/': Landing,
  //  '/login': Login
  '/login': LogIn,
  // NOTE : would like /auth/resetPassword, but current router does not read
  // params in `?atr=value&atr=value` form
  '/auth/reset/:id': InjectRouteParams(ResetPasswordComponent),
  [FORGOT_PASSWORD_ROUTE]: ForgotPasswordComponent,
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
  // TODO : Type here is nullable firebase.user
  // cf. https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
  authStateChangedEvent$: Stream<firebase.user>;
  firebase: FirebaseSource;
  queue$: QueueSource;
  random: Stream<any>;
}

export function main(sources: MainSources): MainSinks {
  const page = InjectSources({
      routes$: always(just(routes))
    }, ComponentRouter
  )(sources,{});

  return {
    DOM: page.DOM,
    router: page.route$,
    authentication$: page.pluck('authentication$'),
    queue$: page.pluck('queue$'),
    preventDefault: page.pluck('preventDefault'),
  };
}
