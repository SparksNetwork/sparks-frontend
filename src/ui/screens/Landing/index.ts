import { Stream, delay, just } from 'most';
import isolate from '@cycle/isolate';
import { VNode, div, h1 } from '@motorcycle/dom';

export type LandingSinks = {
  DOM: Stream<VNode>;
  route$: Stream<string>;
}

function Landing(): LandingSinks {
  const route$ = delay(2000, just('/login'));

  return {
    DOM: just(
      div({}, [
        h1('.welcome', 'Motorcycle Diversity')
      ])
    ),
    route$
  };
}

export default sources => isolate(Landing)(sources);
