import { Stream, map } from 'most'
import { Location, Pathname } from '@motorcycle/history'
import { div, h2, a } from '@motorcycle/dom'
import { MainSources, MainSinks } from '../../app'

export function ConnectScreen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
    .tap(evt => evt.preventDefault())
    .map(() => '../')

  return {
    dom: map(view, sources.router.history()),
    router,
  }
}

function view(location: Location) {
  return div([
      h2(`Connect: ${location.pathname}`),
      a({attrs: {href: '#'}}, 'Home'),
    ])
}