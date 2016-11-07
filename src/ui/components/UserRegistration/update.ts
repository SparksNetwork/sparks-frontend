import { Message } from './message$';
import { UserRegistrationModel } from './';

export function update(message: Message): UserRegistrationModel {
  return {
    showPasswordStrength: message.passwordInputActive
  };
}
