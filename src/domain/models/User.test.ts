/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { User } from './User';
import { WebUrl } from './WebUrl';
import { EmailAddress } from './EmailAddress';

describe(`domain/models/User`, () => {
  it(`should be a function`, () => {
    assert.strictEqual(typeof User, `function`);
  });

  it(`should set unique id, given a unique id`, () => {
    assertUid(`00000000-0000-0000-0000-000000000000`);
    assertUid(`11111111-1111-1111-1111-111111111111`);
  });

  it(`should set display name, given a display name`, () => {
    assertDisplayName(`display name`);
    assertDisplayName(`other name`);
  });

  it(`should set portrait URL, given a portrait URL`, () => {
    assertPortraitUrl(new WebUrl(`http://www.example.com/image.jpg`));
    assertPortraitUrl(new WebUrl(`http://www.other.com/image.jpg`));
  });

  it(`should set email address, given an email address`, () => {
    assertEmailAddress(new EmailAddress(`mailbox@example.com`));
    assertEmailAddress(new EmailAddress(`other@example.com`));
  });
});

function sutFixture(
  uid: string,
  displayName: string = ``,
  portraitUrl: WebUrl = new WebUrl(`http://www.example.com/image.jpg`),
  emailAddress: EmailAddress = new EmailAddress(`mailbox@example.com`)
): User {
  return new User(uid, displayName, portraitUrl, emailAddress);
}

function assertUid(uid: string) {
  const sut = sutFixture(uid);
  assert.strictEqual(sut.uid(), uid);
}

function assertDisplayName(displayName: string) {
  const sut = sutFixture(`00000000-0000-0000-0000-000000000000`, displayName);
  assert.strictEqual(sut.displayName(), displayName);
}

function assertPortraitUrl(portraitUrl: WebUrl) {
  const sut = sutFixture(
    `00000000-0000-0000-0000-000000000000`,
    `display name`,
    portraitUrl
  );
  assert.deepStrictEqual(sut.portraitUrl(), portraitUrl);
}

function assertEmailAddress(emailAddress: EmailAddress) {
  const sut = sutFixture(
    `00000000-0000-0000-0000-000000000000`,
    `display name`,
    new WebUrl(`http://www.example.com/image.jpg`),
    emailAddress
  );
  assert.deepStrictEqual(sut.emailAddress(), emailAddress);
}