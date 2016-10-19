/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { isEmailAddressValid } from './isEmailAddressValid';

describe(`domain/models/isEmailAddressValid`, () => {
  it(`should be a function`, () => {
    assert.strictEqual(typeof isEmailAddressValid, `function`);
  });

  it(`should return true, given a valid email address`, () => {
    assertValid(`something@something.com`);
    assertValid(`someone@localhost.localdomain`);
    assertValid(`a/b@domain.com`);
    assertValid(`}@domain.com`);
    assertValid(`m*'!%@something.sa`);
    assertValid(`tu!!7n7.ad##0!!!@company.ca`);
    assertValid(`%@com.com`);
    assertValid(`!#$%&'*+/=?^_\`{|}~.-@com.com`);
    assertValid(`.wooly@example.com`);
    assertValid(`wo..oly@example.com`);
    assertValid(`someone@do-ma-in.com`);
    assertValid(`\u000Aa@p.com\u000A`);
    assertValid(`\u000Da@p.com\u000D`);
    assertValid(`a\u000A@p.com`);
    assertValid(`a\u000D@p.com`);
    assertValid(` a@p.com`);
    assertValid(`a@p.com `);
    assertValid(` a@p.com `);
    assertValid(`\u0020a@p.com\u0020`);
    assertValid(`\u0009a@p.com\u0009`);
    assertValid(`\u000Ca@p.com\u000C`);
  });

  it(`should return false, given an invalid email address`, () => {
    assertInvalid(`@somewhere.com`);
    assertInvalid(`example.com"`);
    assertInvalid(`@@example.com`);
    assertInvalid(`someone@somewhere.com.`);
    assertInvalid(`someone@somewhere.com@`);
    assertInvalid(`someone@somewhere_com`);
    assertInvalid(`.`);
  });
});

function assertValid(address: string) {
  assert.ok(isEmailAddressValid(address), address);
}

function assertInvalid(address: string) {
  assert.ok(!isEmailAddressValid(address), address);
}