import { Stream, just, startWith, constant, merge } from 'most';
import { Pathname } from '@motorcycle/history';
import { div, ul, li, img, span, a, button, input, form, label } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
import {
  REDIRECT,
  GET_REDIRECT_RESULT,
  AuthenticationType,
} from '../../drivers/firebase-authentication';
import firebase = require('firebase');

const redirectResultAuthenticationType: AuthenticationType =
  { method: GET_REDIRECT_RESULT };

const googleRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider(),
  };

const facebookRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.FacebookAuthProvider(),
  };

export function ConnectScreen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
      .tap(evt => evt.preventDefault())
      .map(() => '/');

  const googleClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--google').events('click')
      .tap(evt => evt.preventDefault());

  const googleAuth$: Stream<AuthenticationType> =
    startWith(redirectResultAuthenticationType,
      constant(googleRedirectAuthentication, googleClick$));

  const facebookClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--facebook').events('click')
      .tap(evt => evt.preventDefault());

  const facebookAuth$: Stream<AuthenticationType> =
    startWith(redirectResultAuthenticationType,
      constant(facebookRedirectAuthentication, facebookClick$));

  return {
    dom: just(view()),
    router,
    authentication$: merge(googleAuth$, facebookAuth$),
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
              img('.c-btn-federated__icon', { props: { src: '' } }),
              span('.c-btn-federated__text', 'Sign in with Google'),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--facebook', [
              img('.c-btn-federated__icon', { props: { src: '' } }),
              span('.c-btn-federated__text', 'Sign in with Facebook'),
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
            button('.c-btn.c-btn--primary.c-sign-in__submit', 'Sign in'),
          ]),
        ]),
        div([
          a({ props: { href: '/sign-up' } }, 'New to Sparks.Network? Sign up'),
        ]),
      ]),
    ]),
  ]);
}
