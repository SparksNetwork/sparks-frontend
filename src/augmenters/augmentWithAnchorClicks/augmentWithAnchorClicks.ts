import { Stream, map, merge, tap } from 'most';
import { Component, Sinks } from '@motorcycle/core';
import { DomSource, query, events } from '@motorcycle/dom';
import { Path, RouterInput } from '@motorcycle/router';
import { DomSources, RouterSinks } from '../../types';
import { touchTap } from '../../dom-behaviors';

const click = events('click');

export function augmentWithAnchorClicks<Sources extends DomSources, ComponentSinks extends Sinks>(
  Component: Component<Sources, ComponentSinks>)
{
  return function AugmentedComponentWithAnchorClicks(
    sources: Sources): ComponentSinks & RouterSinks
  {
    const anchor: DomSource = query('A', sources.dom);

    const anchorClick$: Stream<Event> = tap(preventDefault, click(anchor));

    const anchorTap$: Stream<Event> = tap(preventDefault, touchTap(anchor));

    const path$: Stream<Path> =
      map(eventToPath, merge(anchorClick$, anchorTap$));

    const sinks: ComponentSinks = Component(sources);

    const router: RouterInput = (sinks as any).router ?
      merge((sinks as any).router, path$) : path$;

    sinks['router'] = router;

    return sinks as ComponentSinks & RouterSinks;
  };
}

function eventToPath(event: Event): Path {
  return (event.target as HTMLAnchorElement).pathname;
}

function preventDefault(event: Event) {
  event.preventDefault();
}
