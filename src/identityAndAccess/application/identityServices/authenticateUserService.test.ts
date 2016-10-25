/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import {
  UserRepository,
  UserCandidate,
  User,
  UserId,
  EmailAddress,
  UserDescriptor
} from '../../domain/model/identity/';
import { AuthenticateUserCommand } from '../commands/';
import { authenticateUserService } from './';

describe(`authenticate user service`, () => {
  class FakeUserRepository
    implements UserRepository {

    private _users: Map<string, User> = new Map<string, User>();
    private _nextId: number = 0;

    add(userCandidate: UserCandidate): Promise<User> {
      const emailAddress: string = userCandidate.emailAddress().address();

      const user: User = new User(
        new UserId(`${++this._nextId}`),
        new EmailAddress(emailAddress)
      );

      this._users.set(emailAddress, user);

      return Promise.resolve(user);
    }

    userFromAuthenticCredentials(
        emailAddress: EmailAddress,
        password: string): Promise<User> {

      Function.prototype(password);
      const user: User = this._users.get(emailAddress.address());

      return Promise.resolve(user);
    }
  }

  it(`authenticates a user`, (done) => {
    const firstUserEmailAddress: EmailAddress =
      new EmailAddress(`dummy@email.address`);
    const secondUserEmailAddress: EmailAddress =
      new EmailAddress(`otherdummy@email.address`);

    const commandForTest: AuthenticateUserCommand =
      new AuthenticateUserCommand(firstUserEmailAddress.address(), `secret`);

    const userRepositoryForTest: UserRepository = new FakeUserRepository();
    userRepositoryForTest.add(
      new UserCandidate(firstUserEmailAddress, `secret`));
    userRepositoryForTest.add(
      new UserCandidate(secondUserEmailAddress, `other secret`));

    const userDescriptorPromise: Promise<UserDescriptor> =
      authenticateUserService(commandForTest, userRepositoryForTest);

    userDescriptorPromise
      .then((userDescriptor: UserDescriptor) => {
        assert.strictEqual(
          userDescriptor.emailAddress(),
          commandForTest.emailAddress());

        done();
      })
      .catch(done);
  });
});
