import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { addToUserRepository }
  from '../../domain/model/identity/addToUserRepository';
import { User } from '../../domain/model/identity/User';
import { UserCandidate } from '../../domain/model/identity/UserCandidate';
import { EmailAddress } from '../../domain/model/identity/EmailAddress';

export function registerUserService(
    command: RegisterUserCommand,
    addToUserRepository: addToUserRepository): User {

  const userCandidate = userFromCommand(command);
  const user = addToUserRepository(userCandidate);

  guardUser(user);

  return user;
}

function userFromCommand(command: RegisterUserCommand): UserCandidate {
  return new UserCandidate(
    new EmailAddress(command.emailAddress()),
    command.password()
  );
}

function guardUser(user: User) {
  const FAILURE_USER_NOT_REGISTERED = `User not registered.`;

  if (user.isMissing()) {
    throw new Error(FAILURE_USER_NOT_REGISTERED);
  }
}
