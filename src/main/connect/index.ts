import { Stream, just, startWith, constant } from 'most'
import { Pathname } from '@motorcycle/history'
import { div, h2, a, button, p, input, form } from '@motorcycle/dom'
import { MainSources, MainSinks } from '../../app'
import { REDIRECT, GET_REDIRECT_RESULT, AuthenticationType } from '../../drivers/firebase-authentication'
import firebase = require('firebase')

const redirectResultAuthenticationType: AuthenticationType =
  { method: GET_REDIRECT_RESULT };

const googleRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider(),
  };

export function ConnectScreen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
    .tap(evt => evt.preventDefault())
    .map(() => '/')

  const googleClick$: Stream<Event> =
    sources.dom.select('.c-btn--google').events('click')
    .tap(evt => evt.preventDefault())
    .tap(() => console.log('googleClick$'))

  const authentication$: Stream<AuthenticationType> =
    startWith(redirectResultAuthenticationType, constant(googleRedirectAuthentication, googleClick$))

  return {
    dom: just(view()),
    router,
    authentication$,
  }
}

function view() {
  return div('#page', [
      div('#dialog', [
        h2('Connect to the Sparks.Network'),
        div('.highlighted', [
          a({attrs: {href: '#'}}, 'I have a profile, sign in with that'),
        ]),
        p('To apply, we need to be able to reach you.'),
        div([
          button('.c-btn--google', 'Connect with Google'),
          button('.c-btn--facebook', 'Connect with Facebook'),
        ]),
        p('.note', 'We will never post without your permission'),
        div('.divider', 'Or create with email'),
        form([
          input('.email'),
          input('.password', {attrs: {type: 'password'}}),
          button({attrs: {type: 'submit'}}),
        ]),
        p('.note', [
          'By creating a profile you agree to our',
          a({attrs: {href: '#'}}, 'terms and conditions'),
        ])
      ]),
    ])
}
