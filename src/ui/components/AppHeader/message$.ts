import { AppHeaderSources } from './';
import * as style from './style';
import { Stream, fromEvent } from 'most';
import { VNode } from '@motorcycle/dom';
import { combineObj } from '../../../helpers';

export type Message =
  {
    height: number;
    scrollTop: number;
    childViews: Array<VNode>;
  };

export function message$(sources: AppHeaderSources): Stream<Message> {
  const { dom, childViews$ } = sources;

  const height$: Stream<number> =
    dom.select(style.host)
      .elements()
      .take(2)
      .delay(1)
      .map((elements: Array<HTMLElement>) => {
        return elements.length > 0 ?
          elements[0].offsetHeight :
          0;
      });

  // @TODO This workaround needs to live in the DOM driver.
  const scroll$: Stream<Event> =
    fromEvent(`scroll`, window);

  const scrollTop$: Stream<number> =
    scroll$
      .map(event => (event.currentTarget as Window).pageYOffset)
      .skipRepeats()
      .startWith(0);

  const message$: Stream<Message> =
    combineObj<Message>(
      {
        height$,
        scrollTop$,
        childViews$,
      }
    );

  return message$;
}
