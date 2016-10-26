/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, User, EmailAddress, UserDescriptor } from './';

describe(`user`, () => {
  it(`sets a user id`, () => {
    const emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);
    const password: string = `secret`;

    let userId: UserId = new UserId(`T12345`);
    let user: User = new User(userId, emailAddress, password);

    assert.strictEqual(user.userId(), userId);

    userId = new UserId(`T98765`);
    user = new User(userId, emailAddress, password);

    assert.strictEqual(user.userId(), userId);
  });

  it(`sets an email address`, () => {
    const userId: UserId = new UserId(`T12345`);
    const password: string = `secret`;

    let emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);
    let user: User = new User(userId, emailAddress, password);

    assert.strictEqual(user.emailAddress(), emailAddress);

    emailAddress = new EmailAddress(`otherdummy@email.address`);
    user = new User(userId, emailAddress, password);

    assert.strictEqual(user.emailAddress(), emailAddress);
  });

  it(`sets a password`, () => {
    const userId: UserId = new UserId(`T12345`);
    const emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);

    let password: string = `secret`;
    let user: User = new User(userId, emailAddress, password);

    assert.strictEqual(user.password(), password);

    password = `other secret`;
    user = new User(userId, emailAddress, password);

    assert.strictEqual(user.password(), password);
  });

  it(`has a user descriptor`, () => {
    const emailAddress: EmailAddress = new EmailAddress(`dummy@email.address`);
    const password: string = `secret`;

    let user: User = new User(new UserId(`T12345`), emailAddress, password);
    let userDescriptor: UserDescriptor = user.userDescriptor();

    assert.strictEqual(userDescriptor.userId(), user.userId());
    assert.strictEqual(
      userDescriptor.emailAddress(),
      user.emailAddress().address());

    user = new User(new UserId(`T98765`), emailAddress, password);
    userDescriptor = user.userDescriptor();

    assert.strictEqual(userDescriptor.userId(), user.userId());
    assert.strictEqual(
      userDescriptor.emailAddress(),
      user.emailAddress().address());
  });
});
