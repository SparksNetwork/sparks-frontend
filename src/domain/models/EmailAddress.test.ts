/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { EmailAddress } from './EmailAddress';

describe(`domain/models/EmailAddress`, () => {
  it(`should be a function`, () => {
    assert.strictEqual(typeof EmailAddress, `function`);
  });

  it(`should set email address, given a valid email address`, () => {
    assertAddress(`something@something.com`);
    assertAddress(`someone@localhost.localdomain`);
    assertAddress(`a/b@domain.com`);
    assertAddress(`}@domain.com`);
    assertAddress(`m*'!%@something.sa`);
    assertAddress(`tu!!7n7.ad##0!!!@company.ca`);
    assertAddress(`%@com.com`);
    assertAddress(`!#$%&'*+/=?^_\`{|}~.-@com.com`);
    assertAddress(`.wooly@example.com`);
    assertAddress(`wo..oly@example.com`);
    assertAddress(`someone@do-ma-in.com`);
    assertAddress(`\u000Aa@p.com\u000A`);
    assertAddress(`\u000Da@p.com\u000D`);
    assertAddress(`a\u000A@p.com`);
    assertAddress(`a\u000D@p.com`);
    assertAddress(` a@p.com`);
    assertAddress(`a@p.com `);
    assertAddress(` a@p.com `);
    assertAddress(`\u0020a@p.com\u0020`);
    assertAddress(`\u0009a@p.com\u0009`);
    assertAddress(`\u000Ca@p.com\u000C`);
  });

  it(`should throw, given an invalid email address`, () => {
    assert.throws(() => new EmailAddress(`@somewhere.com`));
    assert.throws(() => new EmailAddress(`example.com"`));
    assert.throws(() => new EmailAddress(`@@example.com`));
    assert.throws(() => new EmailAddress(`someone@somewhere.com.`));
    assert.throws(() => new EmailAddress(`someone@somewhere.com@`));
    assert.throws(() => new EmailAddress(`someone@somewhere_com`));
    assert.throws(() => new EmailAddress(`.`));
  });

  it(`should return false when calling isMissing()`, () => {
    const sut = sutFixture();
    assert.ok(!sut.isMissing());
  });
});

function sutFixture(address: string = `dummy@email.address`) {
  return new EmailAddress(address);
}

function assertAddress(address: string) {
  const sut = sutFixture(address);
  assert.strictEqual(sut.address(), address);
}