/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { mockDOMSource, DOMSource } from '@motorcycle/dom';
import { just } from 'most';
import { createAuthenticationMethod$ } from './createAuthenticationMethod$';
import {
  EmailAndPasswordAuthentincationMethod,
  GOOGLE,
  FACEBOOK,
  EMAIL_AND_PASSWORD
} from '../../higher-order-components/authenticate';

function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

const noop = Function.prototype;

describe('createAuthenticatMethod$', () => {
  it('should be a function', () => {
    assert(typeof createAuthenticationMethod$ === 'function');
  });

  it('should return a stream given a DOMSource', () => {
    const domSource = mockDOMSource({}) as any as DOMSource;
    assert(typeof createAuthenticationMethod$(domSource).observe === 'function');
  });

  describe('stream', () => {
    it('should contain an object', () => {
      const domSource = mockAsDomSource({});

      return createAuthenticationMethod$(domSource).observe(authenticationMethod => {
        assert(typeof authenticationMethod === 'object');
      });
    });
  });

  describe('given a DOMSource', () => {
    describe('with `.google` click event', () => {
      const domSource = mockAsDomSource({
        '.google': {
          'click': just(1)
        }
      });

      it('should have a property `method` of type `GOOGLE`', (done) => {
        createAuthenticationMethod$(domSource)
          .observe((authenticationMethod) => {
            assert(authenticationMethod.method === GOOGLE);
            done();
          })
          .catch(done);
      });
    });

    describe('with `.facebook` click event', () => {
      const domSource = mockAsDomSource({
        '.facebook': {
          'click': just(1)
        }
      });

      it('should have a property `method` of type `FACEBOOK`', (done) => {
        createAuthenticationMethod$(domSource)
          .observe((authenticationMethod) => {
            assert(authenticationMethod.method === FACEBOOK);
            done();
          })
          .catch(done);
      });
    });

    describe('with `.email` input event, `.password` input event` and `.submit` click event', () => {
      const EMAIL_VALUE = 'email';
      const PASSWORD_VALUE = 'password';

      const domSource = mockAsDomSource({
        '.login.email': {
          'input': just({ target: { value: EMAIL_VALUE } })
        },
        '.login.password': {
          'input': just({ target: { value: PASSWORD_VALUE } })
        },
        '.submit': {
          'click': just({ preventDefault: noop }).delay(100)
        }
      });

      it('should have property `method` of type `EMAIL_AND_PASSWORD`', (done) => {
        createAuthenticationMethod$(domSource)
          .observe((authenticationMethod) => {
            assert(authenticationMethod.method === EMAIL_AND_PASSWORD);
            done();
          }).catch(done);
      });

      it('should return an EmailAndPasswordAuthenticationMethod', (done) => {
        createAuthenticationMethod$(domSource)
          .observe((authenticationMethod) => {
            const { email, password } = authenticationMethod as EmailAndPasswordAuthentincationMethod;
            assert(email === EMAIL_VALUE);
            assert(password === PASSWORD_VALUE);
            done();
          }).catch(done);
      });
    });
  });
});
