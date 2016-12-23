import { Stream, just } from 'most';
import { Pathname } from '@motorcycle/history';
import { div, ul, li, img, label, span, a, button, input, form } from '@motorcycle/dom';
import { MainSources, MainSinks } from '../../app';
import {
  AuthenticationType,
  redirectAuthAction,
  googleRedirectAuthentication,
} from '../../drivers/firebase-authentication';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

export function SignInScreen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
      .tap(evt => evt.preventDefault())
      .map(evt => (evt.target as HTMLAnchorElement).pathname);

  const googleClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--google').events('click')
      .tap(evt => evt.preventDefault());

  const authentication$: Stream<AuthenticationType> =
    redirectAuthAction(googleRedirectAuthentication, googleClick$);

  return {
    dom: just(view()),
    authentication$,
    router,
  };
}

function view() {
  return div('#page', [
    div('.c-sign-in', [
      form('.c-sign-in__form', [
        div('.c-sign-in__title', 'Sign in to the Sparks.Network'),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--google', {
              props: { type: 'button' } }, [
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
      ]),
    ]),
  ]);
}
