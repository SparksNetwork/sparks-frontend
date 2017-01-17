import { Stream, just, merge, combine, concat, empty } from 'most';
import hold from '@most/hold';
import { Path } from '@motorcycle/history';
import { div, ul, li, img, span, a, button, input, form, label } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
import {
  CreateUserAuthentication,
  EmailAndPasswordAuthentication,
  EMAIL_AND_PASSWORD,
} from '../../drivers/firebase-authentication';

const DASHBOARD_ROUTE = '/dash';
const WRONG_PASSWORD_ERROR = 'Wrong password!! Please try again!';
const WRONG_EMAIL_ERROR = 'Wrong email!! Please try again!';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

export function SignInScreen(sources: MainSources): MainSinks {
  const { isAuthenticated$, authentication$, dom } = sources;

  let events = {
    emailFieldInput: dom.select('.c-textfield__input--email').events('input'),
    passwordFieldInput: dom.select('.c-textfield__input--password').events('input'),
    formSubmit: dom.select('form').events('submit').multicast(),

    attemptToSignInWithWrongPassword: authentication$
      .filter(authResponse =>
        !!authResponse.error && authResponse.error.code === 'auth/wrong-password',
      )
      .multicast(),
    attemptToSignInWithWrongEmail: authentication$
      .filter(authResponse =>
        !!authResponse.error && authResponse.error.code === 'auth/user-not-found',
      )
      .multicast(),
  };

  let state = {
    email: hold(events.emailFieldInput
      .map(ev => (ev.target as HTMLInputElement).value)),
    password: hold(events.passwordFieldInput
      .map(ev => (ev.target as HTMLInputElement).value)),
    isAuthenticated$,
    errorFeedback: hold(concat<String>(
      just(''),
      merge<String>(
        events.attemptToSignInWithWrongPassword.map(_ => WRONG_PASSWORD_ERROR),
        events.attemptToSignInWithWrongEmail.map(_ => WRONG_EMAIL_ERROR),
        // remove error feedback when submitting
        events.formSubmit.map(_ => ''),
      ),
    )),
  };

  let intents = {
    signUserIn: events.formSubmit.tap(ev => ev.preventDefault()),
  };

  let actions = {
    redirectToDashboard: state.isAuthenticated$
      .filter(Boolean).constant(DASHBOARD_ROUTE) as Stream<Path>,
    signUserIn: combine<string, string, EmailAndPasswordAuthentication>(
      (email, password) => ({ method: EMAIL_AND_PASSWORD, email, password }),
      state.email, state.password,
    ).sampleWith<CreateUserAuthentication>(intents.signUserIn),
  };

  return {
    dom: state.errorFeedback.map(view),
    authentication$: actions.signUserIn,
    router: actions.redirectToDashboard,
    domainAction$: empty()
  };
}

function view(errorFeedback: String) {
  return div('#page', [
    div('.c-sign-in', [
      form('.c-sign-in__form', [
        div('.c-sign-in__title', 'Sign in to the Sparks.Network'),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--google', {
              props: { type: 'button' },
            }, [
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
            div('.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--email', {
                  props: { type: 'text', required: true },
                }),
                span('.c-textfield__label', 'Email address'),
              ]),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            div('.c-sign-in__password.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--password', {
                  props: { type: 'password', required: true },
                }),
                span('.c-textfield__label', 'Password'),
              ]),
              a('.c-sign-in__password-forgot', { props: { href: '/forgot-password' } }, 'Forgot?'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn--primary.c-sign-in__submit', 'Sign in'),
          ]),
        ]),
        div([
          a({ props: { href: '/connect' } }, 'New to the Sparks.Network? Sign up'),
        ]),
        div([
          errorFeedback
            ? div('.c-textfield.c-textfield--errorfield', errorFeedback)
            : null,
        ]),
      ]),
    ]),
  ]);
}
