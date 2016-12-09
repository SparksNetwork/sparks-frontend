import { makeFirebaseUserDriver, FirebaseUserChange } from './index';
import { Stream } from 'most';
import firebase = require('firebase');
import sinon = require('sinon');
import * as assert from 'assert';
/*
makeFirebaseUserDriver
	when created
		should call auth.onAuthStateChange with a function
	when auth.onAuthStateChange fires with user
		should emit a user
  when auth.onAuthStateChange fires with null
    should emit a null
*/

describe.only('firebase authentication', () => {
  let driver;
  let source$: Stream<FirebaseUserChange>;
  let onAuthStateChanged: sinon.SinonSpy;

  beforeEach(() => {
    onAuthStateChanged = sinon.spy();
    driver = makeFirebaseUserDriver(onAuthStateChanged);
    source$ = driver();
  });

  describe('when called', () => {
    it('hooks up to state change driver', done => {
      console.log(onAuthStateChanged.callCount, 'calls');
      assert(onAuthStateChanged.calledOnce, 'onAuthStateChange not called');
      done();
    });
  });

  describe('when onAuthStateChanged fires with a user', () => {
    it('emits that user in its stream', done => {
      const user: firebase.User = {} as firebase.User;
      source$.observe((u: FirebaseUserChange) => {
        assert(u === user, 'emitted user not the same');
        done();
      });
      onAuthStateChanged.firstCall.args[0](user);
    });
  });

  describe('when it fires with null', () => {
    it('emits that null in its stream', done => {
      const user: null = null;
      source$.observe((u: FirebaseUserChange) => {
        assert(u === user, 'emitted user not the same');
        done();
      });
      onAuthStateChanged.firstCall.args[0](user);
    });
  });

  describe('when another observer subscribes', () => {
    it('gets the last user emitted', done => {
      const user: firebase.User = {} as firebase.User;
      source$.observe((u: FirebaseUserChange) => {
        assert(u === user, 'emitted user not the same');
      });
      onAuthStateChanged.firstCall.args[0](user);
      setTimeout(() => {
        source$.observe((u: FirebaseUserChange) => {
          assert(u === user, 'second call emitted user not the same');
          done();
        });
      }, 0);
    });
  });

});
