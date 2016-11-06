import { ButtonSources, ButtonModel } from './';
import { Stream } from 'most';
import { combineObj } from '../../../helpers';

export type Message = {
  props: ButtonModel;
};

export function message$(sources: ButtonSources): Stream<Message> {
  return combineObj<Message>({ props$: sources.props$ });
}
