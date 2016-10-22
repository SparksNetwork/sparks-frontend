/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { registerUserService } from './registerUserService';
import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { UserId } from '../../domain/model/identity/UserId';
import { UserCandidate } from '../../domain/model/identity/UserCandidate';
import { User } from '../../domain/model/identity/User';
import { MissingUser } from '../../domain/model/identity/MissingUser'
import { addToUserRepository } from '../../domain/model/identity/addToUserRepository'

const userRepositoryForTest: Map<UserId, User> =
  new Map<UserId, User>();

const userIdForTest = new UserId(`T12345`);

const userForTest = new User();

const missingUserForTest = new MissingUser();

const addToUserRepositoryForTest: addToUserRepository =
  function addToUserRepository(userCandidate: UserCandidate): User {
    if (!!userRepositoryForTest.get(userIdForTest)) {
      return missingUserForTest;
    }

    userRepositoryForTest.set(userIdForTest, userForTest);

    return userIdForTest;
  };

const commandForTest = new RegisterUserCommand(
  `mailbox@email.address`,
  `secret pass phrase`
)

describe.only(`identityAndAccess/application/identityServices/registerUserService`, () => {
  beforeEach(() => {
    userRepositoryForTest.clear();
  });

  it(`should be a function`, () => {
    assert.strictEqual(typeof registerUserService, `function`);
  });

  it(`should return a User`, () => {
    const user: User =
      registerUserService(commandForTest, addToUserRepositoryForTest);

    assert.ok(user);
  });

  it(`should throw error if User wasn’t registered`, () => {
    assert.throws(
      () => {
        registerUserService(commandForTest, addToUserRepositoryForTest);
        registerUserService(commandForTest, addToUserRepositoryForTest);
      },
      /User/
    );
  });
});
