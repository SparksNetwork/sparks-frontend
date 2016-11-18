import { Stream, merge, constant, scan, map } from 'most';
import { run, DriverFn } from '@motorcycle/core';
import { makeDOMDriver, DOMSource, VNode, div, h2, button } from '@motorcycle/dom';

export interface MainSources {
  DOM: DOMSource;
}

export interface MainSinks {
  DOM: Stream<VNode>;
}

export type CounterMessage = number;

export type CounterModel = number;

const sum = (x: number, y: number) => x + y;

function main(sources: MainSources): MainSinks {
  const increment$: Stream<number> =
    constant(+1, sources.DOM.select('#increment').events('click'));

  const decrement$: Stream<number> =
    constant(-1, sources.DOM.select('#decrement').events('click'));

  const message$: Stream<CounterMessage> =
    merge(increment$, decrement$);

  const model$: Stream<CounterModel> =
    scan(sum, 0, message$);

  const view$: Stream<VNode> =
    map(view, model$);

  return {
    DOM: view$,
  };
}

function view(count: number): VNode {
  return div(`#counter`, {}, [
    h2(`#count`, {}, `Current count: ${count}`),
    button(`#increment`, {}, [`Increment`]),
    button(`#decrement`, {}, [`Decrement`]),
  ]);
}

run<MainSources, MainSinks>(main, {
  DOM: makeDOMDriver('#app') as DriverFn,
});
