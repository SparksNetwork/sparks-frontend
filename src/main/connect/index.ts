import { Stream, just } from 'most'
import { Pathname } from '@motorcycle/history'
import { div, h2, a, button, p, input, form } from '@motorcycle/dom'
import { MainSources, MainSinks } from '../../app'

export function ConnectScreen(sources: MainSources): MainSinks {
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
        h2('Connect to the Sparks.Network'),
        p('.note', [
          a({attrs: {href: '#'}}, 'I have a profile, sign in with that'),
        ]),
        p('To apply, we need to be able to reach you.'),
        div([
          button('.google', 'Connect with Google'),
          button('.facebook', 'Connect with Facebook'),
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
