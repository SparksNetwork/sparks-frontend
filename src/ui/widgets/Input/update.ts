import { InputModel } from './';
import { Message } from './message$';
import { merge } from 'ramda';

export function update(message: Message): InputModel {
  const { props, value } = message;

  return merge(props, { value });
}
