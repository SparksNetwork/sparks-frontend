import { InputSources, InputAttrs } from './';
import { Stream } from 'most';

export type IntentEffects = {
  value$: Stream<string>;
}

export function intent(sources: InputSources): IntentEffects {
  const initialValue$ = (sources.attrs$ as Stream<InputAttrs>)
    .map(attrs => attrs.value as string);

  const value$ = sources.DOM.select(`input`).events(`input`)
    .map(event => (event.target as HTMLInputElement).value)
    .merge(initialValue$);

  return { value$ };
}
