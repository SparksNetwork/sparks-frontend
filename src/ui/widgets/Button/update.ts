import { Message } from './message$';
import { ButtonModel } from './';

export function update(message: Message): ButtonModel {
  return message.props;
}
