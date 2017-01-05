import {
  AuthenticationType,
  facebookRedirectAuthentication,
  googleRedirectAuthentication,
  redirectAuthAction,
} from '../../drivers/firebase-authentication';
import { MainSinks, MainSources } from '../../app';
import { Stream, merge, never } from 'most';
import { a, button, div, form, img, input, label, li, span, ul } from '@motorcycle/dom';

import { Path } from '@motorcycle/history';
import { combineObj } from 'most-combineobj';

const googleIcon = require('assets/images/google.svg');
const facebookIcon = require('assets/images/facebook.svg');

export function SignInScreen(sources: MainSources): MainSinks {
  const { i18n } = sources;
  const router: Stream<Path> =
    sources.isAuthenticated$.filter(Boolean).constant('/dash');

  const googleClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--google').events('click')
      .tap(evt => evt.preventDefault());

  const facebookClick$: Stream<Event> =
    sources.dom.select('.c-btn-federated--facebook').events('click')
      .tap(evt => evt.preventDefault());

  const googleAuth$: Stream<AuthenticationType> =
    redirectAuthAction(googleRedirectAuthentication, googleClick$);

  const facebookAuth$: Stream<AuthenticationType> =
    redirectAuthAction(facebookRedirectAuthentication, facebookClick$);

  const authentication$: Stream<AuthenticationType> =
    merge(googleAuth$, facebookAuth$);

  const translations$: Stream<any> =
    combineObj({
      title: i18n(`signin.title`),
      googleButton: i18n(`signin.googleButton`),
      facebookButton: i18n(`signin.facebookButton`),
      emailLabel: i18n(`signin.emailLabel`),
      passwordLabel: i18n(`signin.passwordLabel`),
      forgotPasswordLink: i18n(`signin.forgotPasswordLink`),
      signInButton: i18n(`signin.signInButton`),
      connectLink: i18n(`signin.connectLink`),
    });

  return {
    dom: translations$.map(view),
    i18n: never(),
    router,
    authentication$,
  };
}

function view(translations: any) {
  const {
    title,
    googleButton,
    facebookButton,
    emailLabel,
    passwordLabel,
    forgotPasswordLink,
    signInButton,
    connectLink,
  } = translations;

  return div('#page', [
    div('.c-sign-in', [
      form('.c-sign-in__form', [
        div('.c-sign-in__title', title),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--google', {
              props: { type: 'button' } }, [
              img('.c-btn-federated__icon', { props: { src: googleIcon } }),
              span('.c-btn-federated__text', googleButton),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn-federated.c-btn-federated--facebook', [
              img('.c-btn-federated__icon', { props: { src: facebookIcon } }),
              span('.c-btn-federated__text', facebookButton),
            ]),
          ]),
        ]),
        ul('.c-sign-in__list', [
          li('.c-sign-in__list-item', [
            div('.c-sign-in__email.c-textfield', [
              label([
                input('.c-textfield__input', { props: { type: 'text', required: true } }),
                span('.c-textfield__label', emailLabel),
              ]),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            div('.c-sign-in__password.c-textfield', [
              label([
                input('.c-textfield__input', { props: { type: 'password', required: true } }),
                span('.c-textfield__label', passwordLabel),
              ]),
              a('.c-sign-in__password-forgot',
                { props: { href: '/forgot-password' } },
                forgotPasswordLink),
            ]),
          ]),
          li('.c-sign-in__list-item', [
            button('.c-btn.c-btn--primary.c-sign-in__submit', signInButton),
          ]),
        ]),
        div([
          a({ props: { href: '/connect' } }, connectLink),
        ]),
      ]),
    ]),
  ]);
}
