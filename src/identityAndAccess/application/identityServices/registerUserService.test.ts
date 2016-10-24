/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, User, UserRepository, UserCandidate }
  from '../../domain/model/identity/';
import { RegisterUserCommand } from '../commands/';
import { registerUserService } from './';

describe(`register user service`, () => {
  const usersForTest: Map<UserId, User> = new Map<UserId, User>();

  class FakeUserRepository
      implements UserRepository {

    add(candidate: UserCandidate): User {
      const userId: UserId = new UserId(`T12345`);
      const user: User = new User(userId, candidate.emailAddress());

      usersForTest.set(userId, user);

      return user;
    }
  }

  const userRepositoryForTest = new FakeUserRepository();
  const commandForTest: RegisterUserCommand =
    new RegisterUserCommand(`dummy@email.address`, `secret`);

  it(`adds user to repository`, () => {
    const user: User = registerUserService(commandForTest, userRepositoryForTest);
    const userId: UserId = user.userId();

    assert.strictEqual(user, usersForTest.get(userId));
  });
});
