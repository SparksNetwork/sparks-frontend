import { Stream, just, merge, combine } from 'most';
import { Pathname } from '@motorcycle/history';
import { div, ul, li, img, span, a, button, input, form, label } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
import {
  AuthenticationType,
  redirectAuthAction,
  googleRedirectAuthentication,
  facebookRedirectAuthentication,
  createUserAuthentication,
} from '../../drivers/firebase-authentication';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

export function ConnectScreen(sources: MainSources): MainSinks {
  const redirectToDashboard$: Stream<Pathname> =
    sources.isAuthenticated$.filter(Boolean).constant('/dash');

  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
      .tap(evt => evt.preventDefault())
      .map(ev => (ev.target as HTMLAnchorElement).pathname)
      .merge(redirectToDashboard$);

  const googleClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--google').events('click')
      .tap(evt => evt.preventDefault());

  const googleAuth$: Stream<AuthenticationType> =
    redirectAuthAction(googleRedirectAuthentication, googleClick$);

  const facebookClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--facebook').events('click')
      .tap(evt => evt.preventDefault());

  const facebookAuth$: Stream<AuthenticationType> =
    redirectAuthAction(facebookRedirectAuthentication, facebookClick$);

  const emailValue$: Stream<string> = sources.dom
    .select('form input[type=text]').events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const passwordValue$: Stream<string> = sources.dom
    .select('form input[type=password]').events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const submit$ = sources.dom.select('form').events('submit')
    .tap(ev => ev.preventDefault());

  const createUser$ =
    combine<string, string, AuthenticationType>(
      createUserAuthentication, emailValue$, passwordValue$,
    )
    .sampleWith<AuthenticationType>(submit$);

  return {
    dom: just(view()),
    router,
    authentication$: merge(createUser$, googleAuth$, facebookAuth$),
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
              span('.c-btn-federated__text', 'Connect with Google'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--facebook', [
              img('.c-btn-federated__icon', { props: { src: facebookIcon } }),
              span('.c-btn-federated__text', 'Connect with Facebook'),
            ]),
          ]),
        ]),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            div('.c-textfield', [
              label([
                input('.c-textfield__input', { props: { type: 'text', required: true } }),
                span('.c-textfield__label', 'Email address'),
              ]),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            div('.c-sign-in__password.c-textfield', [
              label([
                input('.c-textfield__input', { props: { type: 'password', required: true } }),
                span('.c-textfield__label', 'Password'),
              ]),
              a('.c-sign-in__password-forgot', { props: { href: '/forgot-password' } }, 'Forgot?'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn--primary.c-sign-in__submit', 'Connect with Email'),
          ]),
        ]),
        div([
          a({ props: { href: '/signin' } }, 'New to Sparks.Network? Sign up'),
        ]),
      ]),
    ]),
  ]);
}
