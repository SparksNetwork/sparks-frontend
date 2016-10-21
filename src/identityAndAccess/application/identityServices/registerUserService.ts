import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { User } from '../../domain/models/User';
import { EmailAddress } from '../../domain/models/EmailAddress';

export function registerUserService(
    command: RegisterUserCommand,
    addToUserRepository: Function) {

  const user = new User(
    new EmailAddress(command.emailAddress()),
    command.password()
  );

  addToUserRepository(user);
}