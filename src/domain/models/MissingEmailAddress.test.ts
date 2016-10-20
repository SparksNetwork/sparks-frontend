/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { instance } from './MissingEmailAddress';

describe(`domain/models/MissingEmailAddress`, () => {
  it(`should provide an instance factory function`, () => {
    assert.strictEqual(typeof instance, `function`);
  });

  describe(`instance function`, () => {
    it(`should return an instance of MissingEmailAddress`, () => {
      assert.strictEqual((instance().constructor as any).name, `MissingEmailAddress`)
    });

    it(`should always return the same instance`, () => {
      const sut = instance();
      assert.strictEqual(instance(), sut);
    });
  })

  it(`should return true when calling isMissing()`, () => {
    const sut = instance();
    assert.ok(sut.isMissing());
  });
});