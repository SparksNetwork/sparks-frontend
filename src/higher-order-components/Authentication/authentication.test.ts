/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { just } from 'most';
import { AuthInput } from '../../driver/cyclic-fire';
import { authentication, AuthenticationMethod } from './index';

const dummyComponent = function () {
  return {
    authenticationMethod$: just<AuthenticationMethod>('google')
  };
}

describe('authentication', () => {
  it('should be a function', () => {
    assert(typeof authentication === 'function');
  });

  it('should return a function', () => {
    const Component = authentication(dummyComponent);
    assert(typeof Component === 'function');
  });

  describe('AuthenticationComponent', () => {
    const Component = authentication(dummyComponent);

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

          return authentication$.observe((authInput: AuthInput) => {
            assert(typeof authInput === 'object');
          });
        });
      });

      describe('given a component', () => {
        it('should have component\'s sinks', () => {
          let Component = authentication(
            () => ({
              authenticationMethod$: just<AuthenticationMethod>('google'),
              sink: just(1),
            }));
          let sinks = Component({});

          assert(sinks.hasOwnProperty('sink'));

          Component = authentication(() => ({
            authenticationMethod$: just<AuthenticationMethod>('google'),
            other: just(1)
          }));

          sinks = Component({});

          assert(sinks.hasOwnProperty('other'));
        });
      });
    });
  });
});