/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { just, periodic } from 'most';
import firebase = require('firebase');
import { } from 'sparks-schemas';
import {
  AuthenticationType,
  Authentication,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import { authenticate, AuthenticationMethod, GOOGLE } from './index';
import { User } from '../../domain/models/User';

const dummyComponent = function () {
  return {
    authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE })
  };
};

const defaultAuthenticationOuptut$ = just<Authentication>({
  error: null,
  userCredential: {
    user: null,
    credential: null
  }
});

const defaultSources = {
  authentication$: defaultAuthenticationOuptut$
};

describe('higher-order-components/authenticate', () => {
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
      assert(typeof Component(defaultSources) === 'object');
    });

    describe('sinks', () => {
      it('should have property authentication$', () => {
        const sinks = Component(defaultSources);
        assert(sinks.hasOwnProperty('authentication$'));
      });

      describe('authentication$', () => {
        it('should be a stream', () => {
          assert(typeof Component(defaultSources).authentication$.observe === 'function');
        });

        it('should contain value of type AuthenticationInput', () => {
          const { authentication$ } = Component(defaultSources);

          return authentication$.observe((authenticationType: AuthenticationType) => {
            assert(typeof authenticationType === 'object');
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
          let sinks = Component(defaultSources);

          assert(sinks.hasOwnProperty('sink'));

          Component = authenticate(() => ({
            authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE }),
            other: just(1)
          }));

          sinks = Component(defaultSources);

          assert(sinks.hasOwnProperty('other'));
        });

        describe('resulting component\'s sinks', () => {
          it('should start with attempt to retrieve redirect result', (done) => {
            let Component = authenticate(
              () => ({
                authenticationMethod$: just<AuthenticationMethod>({ method: GOOGLE })
              })
            );

            let sinks = Component(defaultSources);

            sinks.authentication$.take(1).observe(authenticationInput => {
              assert(authenticationInput.method === GET_REDIRECT_RESULT);
              done();
            });
          });
        });

        describe('resulting component\'s sources', () => {
          it('should be augmented with isAuthenticated$', (done) => {
            authenticate((sources) => {
              assert(typeof sources.isAuthenticated$.observe === 'function');
              done();

              return {
                authenticationMethod$: just({ method: GOOGLE })
              };
            })(defaultSources);
          });

          it('should be augmented with authenticationError$', (done) => {
            authenticate((sources) => {
              assert(typeof sources.authenticationError$.observe === 'function');
              done();

              return {
                authenticationMethod$: just({ method: GOOGLE })
              };
            })(defaultSources);
          });

          it('should be augmented with user$', (done) => {
            authenticate((sources) => {
              assert(typeof sources.user$.observe === 'function');
              done();

              return {
                authenticationMethod$: just({ method: GOOGLE })
              };
            })(defaultSources);
          });

          describe('isAuthenticated$', () => {
            it('should be false if not signed in', (done) => {
              authenticate((sources) => {
                sources.isAuthenticated$.observe((isAuthenticated) => {
                  assert(isAuthenticated === false);
                  done();
                });

                return {
                  authenticationMethod$: just({ method: GOOGLE })
                };
              })(defaultSources);
            });

            it('should be true if signed in', (done) => {
              const sources = {
                authentication$: just<Authentication>({
                  error: null,
                  userCredential: {
                    user: {} as any as firebase.User,
                    credential: { provider: '' }
                  }
                })
              };

              authenticate((sources) => {
                sources.isAuthenticated$.observe((isAuthenticated) => {
                  assert(isAuthenticated === true);
                  done();
                });

                return {
                  authenticationMethod$: just({ method: GOOGLE })
                };
              })(sources);
            });
          });

          describe('authenticationError$', () => {
            it('should contain authentication errors', (done) => {
              const code = 'Error';
              const message = 'Error';
              const sources = {
                authentication$: just<Authentication>({
                  error: new AuthenticationError(code, message),
                  userCredential: {
                    user: null,
                    credential: null
                  }
                })
              };

              authenticate((sources) => {
                sources.authenticationError$.observe((authenticationError) => {
                  assert(authenticationError instanceof AuthenticationError);
                  done();
                });

                return {
                  authenticationMethod$: just({ method: GOOGLE })
                };
              })(sources);
            });
          });

          describe('user$', () => {
            it('should contain a user if user is not null', (done) => {
              const authenticationInputs = [
                {
                  error: null,
                  userCredential: {
                    user: null,
                    credential: null
                  }
                },
                {
                  error: null,
                  userCredential: {
                    user: {
                      displayName: 'User2',
                      email: 'user2@sparks.network',
                      photoURL: 'http://somewhere.com/image2',
                      uid: '43'
                    } as firebase.User,
                    credential: null
                  }
                }
              ];

              let emittedNumberOfUsers = 0;

              const authentication$ = periodic(100, 1)
                .skip(1)
                .scan(x => x + 1, 0)
                .map(x => authenticationInputs[x])
                .take(2);

              const sources = { authentication$ };

              authenticate((sources) => {
                sources.user$.observe((user: User) => {
                  assert(user instanceof User, 'Not an instance of User');
                  ++emittedNumberOfUsers;
                });

                return {
                  authenticationMethod$: just({ method: GOOGLE })
                };
              })(sources);

              setTimeout(() => {
                assert(emittedNumberOfUsers === 1, `${emittedNumberOfUsers} does not equal 1`);
                done();
              }, 500);
            });
          });

          describe('User', () => {
            it('should have data retrieved from firebase', (done) => {
              const firstUser = {
                displayName: 'First User',
                email: 'firstuser@sparks.network',
                photoURL: 'http://somewhere.com/image',
                uid: '42'
              } as firebase.User;

              const secondUser = {
                displayName: 'Second User',
                email: 'seconduser@sparks.network',
                photoURL: 'http://somewhere.com/image2',
                uid: '43'
              } as firebase.User;

              const authenticationInputs = [
                {
                  error: null,
                  userCredential: {
                    user: firstUser,
                    credential: null
                  }
                },
                {
                  error: null,
                  userCredential: {
                    user: secondUser,
                    credential: null
                  }
                }
              ];

              const authentication$ = periodic(100, 1)
                .skip(1)
                .scan(x => x + 1, 0)
                .map(x => authenticationInputs[x])
                .take(2);

              const sources = { authentication$ };

              authenticate((sources) => {
                sources.user$.take(1).observe((user: User) => {
                  assert.strictEqual(user.displayName(), firstUser.displayName);
                  assert.strictEqual(user.emailAddress().address(), firstUser.email);
                  assert.strictEqual(user.portraitUrl().value(), firstUser.photoURL);
                  assert.strictEqual(user.uid(), firstUser.uid);
                });

                sources.user$.skip(1).observe((user: User) => {
                  assert.strictEqual(user.displayName(), secondUser.displayName);
                  assert.strictEqual(user.emailAddress().address(), secondUser.email);
                  assert.strictEqual(user.portraitUrl().value(), secondUser.photoURL);
                  assert.strictEqual(user.uid(), secondUser.uid);
                  done();
                });

                return {
                  authenticationMethod$: just({ method: GOOGLE })
                };
              })(sources);
            });
          });
        });
      });
    });
  });
});
