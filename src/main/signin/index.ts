import { Stream, just } from 'most'
import { a, button, div, form, h2, input } from '@motorcycle/dom'

import { MainSources } from '../../app'
import { Pathname } from '@motorcycle/history'
import { SigninScreenSinks } from './types';

export function SignInScreen(sources: MainSources): SigninScreenSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
    .tap(evt => evt.preventDefault())
    .map(() => '/')

  return {
    dom: just(view()),
    router,
  }
}

function view() {
  return div('#page', [
      div('#dialog', [
        h2('Sign in to the Sparks.Network'),
        div('.highlighted', [
          a({attrs: {href: '#'}}, 'I don\'t have a profile, let\'s create one'),
        ]),
        div([
          button('.google', 'Sign in with Google'),
          button('.facebook', 'Sign in with Facebook'),
        ]),
        div('.divider', 'Or sign in with email'),
        form([
          input('.email'),
          input('.password', {attrs: {type: 'password'}}),
          button({attrs: {type: 'submit'}}, 'Sign in with email'),
        ]),
      ]),
    ])
}
