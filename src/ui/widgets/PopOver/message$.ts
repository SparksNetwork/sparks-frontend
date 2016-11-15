import { PopOverSources, PopOverProps } from './';
import { Stream } from 'most';
import { combineObj } from '../../../helpers/mostjs/combineObj';
import * as styles from './styles';

export type Message =
  {
    props: PopOverProps;
    parentRect: ClientRect;
    containerRect: ClientRect;
  };

export function message$(sources: PopOverSources): Stream<Message> {
  const { DOM, props$ } = sources;

  const rootElement$: Stream<HTMLElement | null> =
    DOM.select(`.${styles.uniqueRoot}`)
      .elements()
      .take(2)
      .map((elements: Array<HTMLElement>) => {
        return elements.length > 0 ?
          elements[0] :
          null;
      });

  const parentRect$: Stream<ClientRect | null> =
    rootElement$
      .map((element) => element && element.parentElement.getBoundingClientRect())
      .tap(x => console.log(`parent`, x));

  const containerRect$: Stream<ClientRect | null> =
    rootElement$
      .map((element) => element && element.getBoundingClientRect())
      .tap(x => console.log(`container`, x));

  const message$: Stream<Message> =
    combineObj<Message>({
      props$,
      parentRect$,
      containerRect$,
    });

  return message$;
}
