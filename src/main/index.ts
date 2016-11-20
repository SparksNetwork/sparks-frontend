import { Stream, map } from 'most'
import { Location, Pathname } from '@motorcycle/history'
import { div, h2, a } from '@motorcycle/dom'
import { Routing, MainSources, MainSinks } from '../app'

import { ConnectScreen } from './connect'

export function main(sources: MainSources): MainSinks {
  const sinks$: Stream<MainSinks> =
    Routing({
      '/': Screen,
      '/connect': ConnectScreen,
    }, sources)

  return {
    dom: sinks$.map(sinks => sinks.dom).switch(),
    router: sinks$.map(sinks => sinks.router).switch(),
  };
}

function Screen(sources: MainSources): MainSinks {
  const router: Stream<Pathname> =
    sources.dom.select('a').events('click')
    .tap(evt => evt.preventDefault())
    .map(() => '/connect')

  return {
    dom: map(view, sources.router.history()),
    router,
  }
}

function view(location: Location) {
  return div([
      h2(`Home: ${location.pathname}`),
      a({attrs: {href: '#'}}, 'Connect'),
    ])
}
