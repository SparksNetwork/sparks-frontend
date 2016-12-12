import {Stream, just, merge, combine} from 'most';
import {Pathname} from '@motorcycle/history';
import {
  div,
  ul,
  li,
  img,
  span,
  a,
  button,
  input,
  form,
  label
} from '@motorcycle/dom';
import {MainSources, MainSinks} from '../../app';
import {
  AuthenticationType,
  redirectAuthAction,
  CreateUserAuthentication,
  googleRedirectAuthentication,
  facebookRedirectAuthentication,
  CREATE_USER,
} from '../../drivers/firebase-authentication';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

const SIGN_IN_ROUTE = '/signin';
const DASHBOARD_ROUTE = '/dash';

export function ConnectScreen(sources: MainSources): MainSinks {
  const {isAuthenticated$, authentication$, dom} = sources;

  let events = {
    link_click: dom.select('a').events('click'),
    google_click: dom.select('.c-btn-federated--google').events('click'),
    facebook_click: dom.select('.c-btn-federated--facebook').events('click'),
    email_field_input: dom.select('.c-textfield__input--email').events('input'),
    password_field_input: dom.select('.c-textfield__input--password').events('input'),
    form_submit: dom.select('form').events('submit'),
    account_already_exists: authentication$.filter(function isExistingAlready(authResponse) {
      return authResponse.error
        && authResponse.error.code === 'auth/email-already-in-use'
    })
  };

  let state = {
    email: events.email_field_input.map(ev => (ev.target as HTMLInputElement).value),
    password: events.password_field_input.map(ev => (ev.target as HTMLInputElement).value),
    isAuthenticated$
  };

  let intents = {
    connect_with_google: events.google_click.tap(evt => evt.preventDefault()),
    connect_with_facebook: events.facebook_click.tap(evt => evt.preventDefault()),
    navigate_to_sign_in: events.link_click.tap(evt => evt.preventDefault()),
    sign_up: events.form_submit.tap(ev => ev.preventDefault()),
  };

  let actions = {
    redirect_to_dashboard: state.isAuthenticated$.filter(Boolean).constant(DASHBOARD_ROUTE) as Stream<Pathname>,
    navigate_to_sign_in: intents.navigate_to_sign_in.map(ev => (ev.target as HTMLAnchorElement).pathname),
    connect_with_google: redirectAuthAction(googleRedirectAuthentication, intents.connect_with_google),
    connect_with_facebook: redirectAuthAction(facebookRedirectAuthentication, intents.connect_with_facebook),
    sign_up: combine<string, string, CreateUserAuthentication>(
      (email, password) => ({method: CREATE_USER, email, password}),
      state.email, state.password
    ).sampleWith<CreateUserAuthentication>(intents.sign_up)
  };

  return {
    dom: just(view()),
    router: merge(
      actions.redirect_to_dashboard,
      actions.navigate_to_sign_in
    ),
    authentication$: merge(
      actions.connect_with_google,
      actions.connect_with_facebook,
      actions.sign_up
    ),
  };
}

function view() {
  return div('#page', [
    div('.c-sign-in', [
      form('.c-sign-in__form', [
        div('.c-sign-in__title', 'Connect to the Sparks.Network'),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--google', {
                props: {type: 'button'},
              },
              [
                img('.c-btn-federated__icon', {props: {src: googleIcon}}),
                span('.c-btn-federated__text', 'Sign in with Google'),
              ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--facebook', [
              img('.c-btn-federated__icon', {props: {src: facebookIcon}}),
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
                    required: true
                  }
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
                    required: true
                  }
                }),
                span('.c-textfield__label', 'Password'),
              ]),
              a('.c-sign-in__password-forgot', {props: {href: '/forgot-password'}}, 'Forgot?'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn--primary.c-sign-in__submit', 'Create' +
              ' profile with email'),
          ]),
        ]),
        div([
          a({props: {href: SIGN_IN_ROUTE}}, 'By creating a profile, you' +
            ' agree to our terms and conditions'),
        ]),
      ]),
    ]),
  ]);
}
