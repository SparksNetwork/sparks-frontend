import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { UserRepository, User, UserCandidate, EmailAddress }
  from '../../domain/model/identity/';

export function registerUserService(
    command: RegisterUserCommand,
    userRepository: UserRepository): User {

  const user: User = userRepository.add(
    new UserCandidate(
      new EmailAddress(command.emailAddress()),
      command.password()
    ));

  return user;
}
