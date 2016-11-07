import { InputDefaultSources, InputDefaultProps } from './';
import { Stream } from 'most';
import { combineObj } from '../../../helpers/mostjs/combineObj';

export type Message = {
  props: InputDefaultProps;
  value: string;
};

export function message$(sources: InputDefaultSources): Stream<Message> {
  const { props$ } = sources;

  const initialValue$: Stream<string> =
    props$
      .map(props => props.value);

  const value$: Stream<string> =
    sources.DOM.select(`input`).events(`input`)
      .map(event => (event.target as HTMLInputElement).value)
      .merge(initialValue$);

  const message$: Stream<Message> =
    combineObj<Message>({ props$, value$ });

  return message$;
}
