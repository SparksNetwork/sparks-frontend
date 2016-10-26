/// <reference path="../../../../typings/index.d.ts" />
import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { UserRepository, User, UserCandidate, EmailAddress }
  from '../../domain/model/identity/';

export function registerUserService(
    command: RegisterUserCommand,
    userRepository: UserRepository): Promise<User> {

  const userPromise: Promise<User> = userRepository.add(
    new UserCandidate(
      new EmailAddress(command.emailAddress()),
      command.password()
    ));

  return userPromise;
}
