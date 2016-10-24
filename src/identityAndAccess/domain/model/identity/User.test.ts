/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId, User, EmailAddress } from './';

describe(`user`, () => {
  it(`sets user id`, () => {
    let userId = new UserId(`T12345`);
    let user = new User(userId, new EmailAddress(`dummy@email.address`));

    assert.strictEqual(user.userId(), userId);

    userId = new UserId(`T98765`);
    user = new User(userId, new EmailAddress(`dummy@email.address`));

    assert.strictEqual(user.userId(), userId);
  });

  it(`sets email address`, () => {
    const emailAddress = new EmailAddress(`dummy@email.address`);
    const user = new User(new UserId(`T12345`), emailAddress);

    assert.strictEqual(user.emailAddress(), emailAddress);
  });
});
