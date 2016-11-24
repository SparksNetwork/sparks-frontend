import { Stream, just, never } from 'most'
import { Pathname } from '@motorcycle/history'
import { div, h2, a, button, input, form } from '@motorcycle/dom'
import { MainSources, MainSinks } from '../../app'

export function SignInScreen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
    .tap(evt => evt.preventDefault())
    .map(() => '/')

  return {
    dom: just(view()),
    authentication$: never(),
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
