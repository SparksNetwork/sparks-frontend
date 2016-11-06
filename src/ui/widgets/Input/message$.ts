import { InputSources, InputProps } from './';
import { Stream } from 'most';
import { combineObj } from '../../../helpers/mostjs/combineObj';

export type Message = {
  props: InputProps;
  value: string;
};

export function message$(sources: InputSources): Stream<Message> {
  const { props$ } = sources;

  const initialValue$: Stream<string> =
    (props$ as Stream<InputProps>)
      .map(props => props.value as string);

  const value$: Stream<string> =
    sources.DOM.select(`input`).events(`input`)
      .map(event => (event.target as HTMLInputElement).value)
      .merge(initialValue$);

  const message$: Stream<Message> =
    combineObj<Message>({ props$, value$ });

  return message$;
}
