/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { EmailAddress, UserCandidate } from './';

describe(`user candidate`, () => {
  it(`sets email address`, () => {
    let emailAddress = new EmailAddress(`dummy@email.address`);
    let userCandidate = new UserCandidate(emailAddress, `secret`);

    assert.strictEqual(userCandidate.emailAddress(), emailAddress);

    emailAddress = new EmailAddress(`other@email.address`);
    userCandidate = new UserCandidate(emailAddress, `secret`);

    assert.strictEqual(userCandidate.emailAddress(), emailAddress);
  });

  it(`requires a password`, () => {
    assert.throws(
      () => {
        new UserCandidate(new EmailAddress(`dummy@email.address`), ``);
      },
      /password.+required/
    );
  });

  it(`sets password`, () => {
    let password = `secret`;
    let userCandidate = new UserCandidate(new EmailAddress(`dummy@email.address`), password);

    assert.strictEqual(userCandidate.password(), password);

    password = `other secret`;
    userCandidate = new UserCandidate(new EmailAddress(`dummy@email.address`), password);

    assert.strictEqual(userCandidate.password(), password);
  });
});
