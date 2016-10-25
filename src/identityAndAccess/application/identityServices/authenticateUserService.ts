/// <reference path="../../../../typings/index.d.ts" />
import { AuthenticateUserCommand } from '../commands/';
import { UserRepository, UserDescriptor, EmailAddress, User }
  from '../../domain/model/identity/';

export function authenticateUserService(
    command: AuthenticateUserCommand,
    userRepository: UserRepository): Promise<UserDescriptor> {

  const userPromise: Promise<User> =
    userRepository.userFromAuthenticCredentials(
      new EmailAddress(command.emailAddress()),
      command.password());

  const userDescriptorPromise: Promise<UserDescriptor> =
    userPromise
      .then((user: User) => {
        return Promise.resolve(user.userDescriptor());
      });

  return userDescriptorPromise;
}
