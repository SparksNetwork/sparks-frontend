/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, UserDescriptor } from './';

describe(`user descriptor`, () => {
  it(`sets a user id`, () => {
    let userId = new UserId(`T12345`);
    let userDescriptor = new UserDescriptor(userId, `dummy@email.address`);

    assert.strictEqual(userDescriptor.userId(), userId);

    userId = new UserId(`T98765`);
    userDescriptor = new UserDescriptor(userId, `dummy@email.address`);

    assert.strictEqual(userDescriptor.userId(), userId);
  });

  it(`sets an email address`, () => {
    const userId = new UserId(`T12345`);
    let emailAddress = `dummy@email.address`;
    let userDescriptor = new UserDescriptor(userId, emailAddress);

    assert.strictEqual(userDescriptor.emailAddress(), emailAddress);

    emailAddress = `otherdummy@email.address`;
    userDescriptor = new UserDescriptor(userId, emailAddress);

    assert.strictEqual(userDescriptor.emailAddress(), emailAddress);
  })
});
