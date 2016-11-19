import { DOMSource } from '@motorcycle/dom';
import { Component, Sources } from '../../components/types';
import { Stream } from 'most';

type DomSources = Sources &
  {
    dom: DOMSource;
  };

type EventSinks =
  {
    [name: string]: Stream<Event>;
  };

export function augmentComponentWithEvents<Sinks>(
  Component: Component<DomSources, Sinks>,
  eventNames: Array<string>): (sources: DomSources) => Sinks
{
  return function AugmentationComponent(sources: DomSources): Sinks & EventSinks {
    const sinks: Sinks = Component(sources);

    const eventNameCount: number = eventNames.length;

    for (let idx: number = 0; idx < eventNameCount; ++idx)
      sinks[eventNames[idx] + `$`] =
        sources.dom.select(`div`).events(eventNames[idx]);

    return sinks as Sinks & EventSinks;
  };
}
