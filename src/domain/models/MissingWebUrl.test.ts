/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { instance } from './MissingWebUrl';

describe(`domain/models/MissingWebUrl`, () => {
  it(`should provide an instance factory function`, () => {
    assert.strictEqual(typeof instance, `function`);
  });

  describe(`instance function`, () => {
    it(`should return an instance of MissingWebUrl`, () => {
      assert.strictEqual((instance().constructor as any).name, `MissingWebUrl`)
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