import { Stream, just, merge, combine, concat, empty } from 'most';
import hold from '@most/hold';
import { Path } from '@motorcycle/history';
import { div, ul, li, img, span, a, button, input, form, label } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
import {
  redirectAuthAction,
  CreateUserAuthentication,
  EmailAndPasswordAuthentication,
  googleRedirectAuthentication,
  facebookRedirectAuthentication,
  CREATE_USER,
  EMAIL_AND_PASSWORD,
} from '../../drivers/firebase-authentication';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

const SIGN_IN_ROUTE = '/signin';
const DASHBOARD_ROUTE = '/dash';
const WRONG_PASSWORD_ERROR = 'Wrong password!! Please try again!';

function preventDefault(ev: any) {
  ev.preventDefault();
}

export function ConnectScreen(sources: MainSources): MainSinks {
  const { isAuthenticated$, authentication$, dom } = sources;

  let events = {
    linkClick: dom.select('a').events('click'),
    googleClick: dom.select('.c-btn-federated--google').events('click'),
    facebookClick: dom.select('.c-btn-federated--facebook').events('click'),
    emailFieldInput: dom.select('.c-textfield__input--email').events('input'),
    passwordFieldInput: dom.select('.c-textfield__input--password').events('input'),
    formSubmit: dom.select('form').events('submit'),

    accountAlreadyExists: authentication$
      .filter(authResponse =>
        !!authResponse.error && authResponse.error.code === 'auth/email-already-in-use',
      )
      .multicast(),
    attemptToLogInWithWrongPassword: authentication$
      .filter(authResponse =>
        !!authResponse.error && authResponse.error.code === 'auth/wrong-password',
      )
      .multicast(),
  };

  let state = {
    email: events.emailFieldInput
      .map(ev => (ev.target as HTMLInputElement).value),
    password: events.passwordFieldInput
      .map(ev => (ev.target as HTMLInputElement).value),
    isAuthenticated$,
    errorFeedback: hold(concat<Boolean>(
      just(false),
      merge(
        events.attemptToLogInWithWrongPassword.map(_ => true),
        // remove error feedback when submitting
        events.formSubmit.map(_ => false),
      ),
    )),
  };

  let intents = {
    connectWithGoogle: events.googleClick.tap(preventDefault),
    connectWithFacebook: events.facebookClick.tap(preventDefault),
    navigateToSignIn: events.linkClick.tap(preventDefault),
    signUp: events.formSubmit.tap(preventDefault),
    logUserIn: events.accountAlreadyExists,
  };

  let actions = {
    redirectToDashboard: state.isAuthenticated$
      .filter(Boolean).constant(DASHBOARD_ROUTE) as Stream<Path>,
    navigateToSignIn: intents.navigateToSignIn
      .map(ev => (ev.target as HTMLAnchorElement).pathname),
    connectWithGoogle: redirectAuthAction(
      googleRedirectAuthentication, intents.connectWithGoogle,
    ),
    connectWithFacebook: redirectAuthAction(
      facebookRedirectAuthentication, intents.connectWithFacebook,
    ),

    signUp: combine<string, string, CreateUserAuthentication>(
      (email, password) => ({ method: CREATE_USER, email, password }),
      state.email, state.password,
    ).sampleWith<CreateUserAuthentication>(intents.signUp),

    logUserIn: combine<string, string, EmailAndPasswordAuthentication>(
      (email, password) => ({ method: EMAIL_AND_PASSWORD, email, password }),
      state.email, state.password,
    ).sampleWith<CreateUserAuthentication>(intents.logUserIn),
  };

  return {
    dom: state.errorFeedback.map(view),
    router: merge(
      actions.redirectToDashboard,
      actions.navigateToSignIn,
    ),
    authentication$: merge(
      actions.connectWithGoogle,
      actions.connectWithFacebook,
      actions.signUp,
      actions.logUserIn,
    ),
    domainAction$: empty()
  };
}

function view(errorFeedback: Boolean) {
  return div('#page', [
    div('.c-sign-in', [
      form('.c-sign-in__form', [
        div('.c-sign-in__title', 'Connect to the Sparks.Network'),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--google', {
                props: { type: 'button' },
              },
              [
                img('.c-btn-federated__icon', { props: { src: googleIcon } }),
                span('.c-btn-federated__text', 'Sign in with Google'),
              ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--facebook', [
              img('.c-btn-federated__icon', { props: { src: facebookIcon } }),
              span('.c-btn-federated__text', 'Sign in with Facebook'),
            ]),
          ]),
        ]),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            div('.c-sign-in__email.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--email', {
                  props: {
                    type: 'text',
                    required: true,
                  },
                }),
                span('.c-textfield__label', 'Email address'),
              ]),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            div('.c-sign-in__password.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--password', {
                  props: {
                    type: 'password',
                    required: true,
                  },
                }),
                span('.c-textfield__label', 'Password'),
              ]),
              a('.c-sign-in__password-forgot', { props: { href: '/forgot-password' } }, 'Forgot?'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn--primary.c-sign-in__submit', 'Create' +
              ' profile with email'),
          ]),
        ]),
        div([
          a({ props: { href: SIGN_IN_ROUTE } }, 'Already have an account? Sign' +
            ' in!'),
          errorFeedback
            ? div('.c-textfield.c-textfield--errorfield', WRONG_PASSWORD_ERROR)
            : null,
        ]),
      ]),
    ]),
  ]);
}
