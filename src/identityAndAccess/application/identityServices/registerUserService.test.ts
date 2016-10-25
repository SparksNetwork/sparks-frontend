/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, User, UserRepository, UserCandidate }
  from '../../domain/model/identity/';
import { RegisterUserCommand } from '../commands/';
import { registerUserService } from './';

describe(`register user service`, () => {
  const usersForTest: Map<UserId, User> = new Map<UserId, User>();

  class FakeUserRepository {
    add(candidate: UserCandidate): Promise<User> {
      const userId: UserId = new UserId(`T12345`);
      const user: User = new User(userId, candidate.emailAddress());

      usersForTest.set(userId, user);

      return Promise.resolve(user);
    }
  }

  const userRepositoryForTest = new FakeUserRepository();
  const commandForTest: RegisterUserCommand =
    new RegisterUserCommand(`dummy@email.address`, `secret`);

  it(`adds user to repository`, () => {
    const userPromise: Promise<User> =
      registerUserService(
        commandForTest,
        userRepositoryForTest as UserRepository);

    userPromise
      .then((user: User) => {
        const userId: UserId = user.userId();

        assert.strictEqual(user, usersForTest.get(userId));
      });
  });
});
