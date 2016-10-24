/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { EmailAddress } from './EmailAddress';

describe(`email address`, () => {
  it(`requires an address`, () => {
    assert.throws(
      () => {
        new EmailAddress(``);
      },
      /address.+required/
    );
  });

  it(`sets address`, () => {
    let address = `dummy@email.address`;
    let emailAddress = new EmailAddress(address);

    assert.strictEqual(emailAddress.address(), address);
  });
});
