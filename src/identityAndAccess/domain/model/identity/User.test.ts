/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, User, EmailAddress, UserDescriptor } from './';

describe(`user`, () => {
  it(`sets a user id`, () => {
    const emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);

    let userId: UserId = new UserId(`T12345`);
    let user: User = new User(userId, emailAddress);

    assert.strictEqual(user.userId(), userId);

    userId = new UserId(`T98765`);
    user = new User(userId, emailAddress);

    assert.strictEqual(user.userId(), userId);
  });

  it(`sets an email address`, () => {
    const userId: UserId = new UserId(`T12345`);

    let emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);
    let user: User = new User(userId, emailAddress);

    assert.strictEqual(user.emailAddress(), emailAddress);

    emailAddress = new EmailAddress(`otherdummy@email.address`);
    user = new User(userId, emailAddress);

    assert.strictEqual(user.emailAddress(), emailAddress);
  });

  it(`has a user descriptor`, () => {
    const emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);

    let user: User = new User(new UserId(`T12345`), emailAddress);
    let userDescriptor: UserDescriptor = user.userDescriptor();

    assert.strictEqual(userDescriptor.userId(), user.userId());
    assert.strictEqual(
      userDescriptor.emailAddress(),
      user.emailAddress().address());

    user = new User(new UserId(`T98765`), emailAddress);
    userDescriptor = user.userDescriptor();

    assert.strictEqual(userDescriptor.userId(), user.userId());
    assert.strictEqual(
      userDescriptor.emailAddress(),
      user.emailAddress().address());
  });
});
