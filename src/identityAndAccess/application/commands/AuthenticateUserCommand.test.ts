/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { AuthenticateUserCommand } from './';

describe(`authenticate user command`, () => {
  it(`sets an email address`, () => {
    let emailAddress = `dummy@email.address`;
    let command = new AuthenticateUserCommand(emailAddress, `secret`);

    assert.strictEqual(command.emailAddress(), emailAddress);

    emailAddress = `otherdummy@email.address`;
    command = new AuthenticateUserCommand(emailAddress, `secret`);

    assert.strictEqual(command.emailAddress(), emailAddress);
  });

  it(`sets a password`, () => {
    let password = `secret`;
    let command = new AuthenticateUserCommand(`dummy@email.address`, password);

    assert.strictEqual(command.password(), password);

    password = `other secret`;
    command = new AuthenticateUserCommand(`dummy@email.address`, password);

    assert.strictEqual(command.password(), password);
  });
});
