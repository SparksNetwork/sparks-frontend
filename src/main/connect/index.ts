import { Stream, just, merge, combine } from 'most';
import { Pathname } from '@motorcycle/history';
import { div, ul, li, img, span, a, button, input, form, label } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
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
  const {isAuthenticated$, dom} = sources;

  const redirectToDashboard$: Stream<Pathname> =
          isAuthenticated$.filter(Boolean).constant(DASHBOARD_ROUTE);

  const router: Stream<Pathname> =
          dom.select('a').events('click')
            .tap(evt => evt.preventDefault())
            .map(ev => (ev.target as HTMLAnchorElement).pathname)
            .merge(redirectToDashboard$);

  const googleClick$: Stream<Event> =
          dom.select('.c-btn-federated--google').events('click')
            .tap(evt => evt.preventDefault());

  const googleAuth$: Stream<AuthenticationType> =
          redirectAuthAction(googleRedirectAuthentication, googleClick$);

  const facebookClick$: Stream<Event> =
          dom.select('.c-btn-federated--facebook').events('click')
            .tap(evt => evt.preventDefault());

  const facebookAuth$: Stream<AuthenticationType> =
          redirectAuthAction(facebookRedirectAuthentication, facebookClick$);

  const email$ = dom.select('.c-textfield__input--email').events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const password$ = dom.select('.c-textfield__input--password').events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const emailAndPassword$ =
          combine<string, string, CreateUserAuthentication>(
            (email, password) => ({ method: CREATE_USER, email, password }),
            email$, password$
          );

  const submit$ = dom.select('form').events('submit')
    .tap(ev => ev.preventDefault());

  const emailAndPasswordAuthenticationMethod$ = emailAndPassword$
    .sampleWith<CreateUserAuthentication>(submit$);

  return {
    dom: just(view()),
    router,
    authentication$: merge(
      googleAuth$,
      facebookAuth$,
      emailAndPasswordAuthenticationMethod$
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
                input('.c-textfield__input.c-textfield__input--email', { props: { type: 'text', required: true } }),
                span('.c-textfield__label', 'Email address'),
              ]),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            div('.c-sign-in__password.c-textfield', [
              label([
                input('.c-textfield__input.c-textfield__input--password', { props: { type: 'password', required: true } }),
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
          a({ props: { href: SIGN_IN_ROUTE } }, 'By creating a profile, you' +
            ' agree to our terms and conditions'),
        ]),
      ]),
    ]),
  ]);
}
