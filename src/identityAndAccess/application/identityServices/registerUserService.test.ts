/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { registerUserService } from './registerUserService';
import { RegisterUserCommand } from '../commands/RegisterUserCommand';

interface User {
  emailAddress(): EmailAddress;
  password(): string;
}

interface EmailAddress {
  address(): string;
}

const userRepositoryForTest: Map<string, User> =
  new Map<string, User>();

function addToUserRepositoryForTest(user: User) {
  userRepositoryForTest.set(user.emailAddress().address(), user);
}

const commandForTest = new RegisterUserCommand(
  `mailbox@email.address`,
  `secret pass phrase`
)

describe(`identityAndAccess/application/identityServices/registerUserService`, () => {
  it(`should be a function`, () => {
    assert.strictEqual(typeof registerUserService, `function`);
  });

  it(`should add User to User Repository`, () => {
    registerUserService(commandForTest, addToUserRepositoryForTest);
    assert.strictEqual(
      userRepositoryForTest.get(commandForTest.emailAddress())
        .emailAddress().address(),
      commandForTest.emailAddress()
    );
    assert.strictEqual(
      userRepositoryForTest.get(commandForTest.emailAddress()).password(),
      commandForTest.password()
    );
  });
});