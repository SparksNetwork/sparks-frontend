/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { User } from './User';

describe('User', () => {
  it('should be a function', () => {
    assert(typeof User === 'function');
  });

  describe('should be constructed with', () => {
    it('an unique ID', () => {
      const user = createUser({ uid: 'a' });
      assert(user.id() === 'a');
      const user2 = createUser({ uid: 'b' });
      assert(user2.id() === 'b');
    });

    it('a fullName', () => {
      const user = createUser({ fullName: 'fullName' });
      assert(user.fullName() === 'fullName');
      const user2 = createUser({ fullName: 'other' });
      assert(user2.fullName() === 'other');
    });

    it('a portraitUrl', () => {
      const user = createUser({ portraitUrl: 'url' });
      assert(user.portraitUrl() === 'url');
      const user2 = createUser({ portraitUrl: 'other' });
      assert(user2.portraitUrl() === 'other');
    });

    it('an email', () => {
      const user = createUser({ email: 'user@sparks.network' });
      assert(user.email() === 'user@sparks.network');
      const user2 = createUser({ email: 'other@sparks.network' });
      assert(user2.email() === 'other@sparks.network');
    });
  });
});

function createUser(options) {
  const uid = options.uid || '';
  const fullName = options.fullName || '';
  const portraitUrl = options.portraitUrl || '';
  const email = options.email || '';
  return new User(uid, fullName, portraitUrl, email);
}