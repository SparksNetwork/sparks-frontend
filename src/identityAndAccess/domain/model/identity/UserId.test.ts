/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserId } from './';

describe(`user id`, () => {
  it(`requires an id`, () => {
    assert.throws(
      () => {
        new UserId(``);
      },
      /id.+required/
    );
  });

  it(`sets id`, () => {
    let id = `T12345`;
    let userId = new UserId(id);

    assert.strictEqual(userId.id(), id);

    id = `T98765`;
    userId = new UserId(id);

    assert.strictEqual(userId.id(), id);
  });
});
