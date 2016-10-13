/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { just } from 'most';
import { AuthenticationInput } from '../../driver/firebase-authentication';
import { authenticate, AuthenticationMethod, GOOGLE } from './index';

const dummyComponent = function () {
  return {
    authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE })
  };
};

describe('authenticate', () => {
  it('should be a function', () => {
    assert(typeof authenticate === 'function');
  });

  it('should return a function', () => {
    const Component = authenticate(dummyComponent);
    assert(typeof Component === 'function');
  });

  describe('AuthenticationComponent', () => {
    const Component = authenticate(dummyComponent);

    it('should return an object', () => {
      assert(typeof Component({}) === 'object');
    });

    describe('sinks', () => {
      it('should have property authentication$', () => {
        const sinks = Component({});
        assert(sinks.hasOwnProperty('authentication$'));
      });

      describe('authentication$', () => {
        it('should be a stream', () => {
          assert(typeof Component({}).authentication$.observe === 'function');
        });

        it('should contain value of type AuthInput', () => {
          const { authentication$ } = Component({});

          return authentication$.observe((authInput: AuthenticationInput) => {
            assert(typeof authInput === 'object');
          });
        });
      });

      describe('given a component', () => {
        it('should have component\'s sinks', () => {
          let Component = authenticate(
            () => ({
              authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE }),
              sink: just(1),
            }));
          let sinks = Component({});

          assert(sinks.hasOwnProperty('sink'));

          Component = authenticate(() => ({
            authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE }),
            other: just(1)
          }));

          sinks = Component({});

          assert(sinks.hasOwnProperty('other'));
        });
      });
    });
  });
});
