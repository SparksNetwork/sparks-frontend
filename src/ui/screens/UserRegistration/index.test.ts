/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode } from '@motorcycle/dom';
import { UserRegistration, UserRegistrationSinks } from './'
const domSelect = require(`snabbdom-selector`).default;

describe.only(`user registration screen`, () => {
  it(`has a DOM stream in its sinks`, (done) => {
    const sinks: UserRegistrationSinks = userRegistrationFixture();

    assert.ok(sinks.hasOwnProperty(`DOM`));
    assert.strictEqual(typeof sinks.DOM.observe, `function`);

    sinks.DOM.observe((view: VNode) => {
      assert.ok(view);
      done();
    })
    .catch(done);
  });

  describe(`view`, () => {
    it(`has a user registration FORM element`, (done) => {
      const sinks: UserRegistrationSinks = userRegistrationFixture();

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`form#UserRegistration-form`, view);

        assert.strictEqual(matches.length, 1);
        done();
      })
        .catch(done);
    });

    describe(`user registration FORM element`, () => {
      it(`has a name FIELDSET element`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(`fieldset#Name-fieldset`, view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
      });

      describe(`name FIELDSET element`, () => {
        it(`has a LEGEND element of text 'Name'`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`legend#Name-legend`, view);

            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].text, `Name`);
            done();
          })
            .catch(done);
        });

        it(`has a first name LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `label#FirstName-label`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });

        describe(`first name LABEL element`, () => {
          it(`has a label text`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `#FirstName-label-text`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });

          it(`has a first name INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#FirstName-input[type='text'][name='FirstName']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });
        });

        it(`has a last name LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `label#LastName-label`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });

        describe(`last name LABEL element`, () => {
          it(`has a label text`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `#LastName-label-text`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });

          it(`has a last name INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#LastName-input[type='text'][name='LastName']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });
        });
      });

      it(`has an email address LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`label#EmailAddress-label`, view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
      });

      describe(`email address LABEL element`, () => {
        it(`has a label text`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `#EmailAddress-label-text`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });

        it(`has an email address INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#EmailAddress-input[type='email'][name='EmailAddress']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });
      });

      it(`has a password LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`label#Password-label`, view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
      });

      describe(`password LABEL element`, () => {
        it(`has a label text`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `#Password-label-text`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });

        it(`has a password INPUT element`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `input#Password-input[type='password'][name='Password']`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });
      });

      it(`has a birthday FIELDSET element`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(`fieldset#Birthday-fieldset`, view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
      });

      describe(`birthday FIELDSET element`, () => {
        it(`has a LEGEND element of text 'Birthday'`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`legend#Birthday-legend`, view);

            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].text, `Birthday`);
            done();
          })
            .catch(done);
        });

        it(`has a birth month LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `label#BirthMonth-label`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });

        describe(`birth month LABEL element`, () => {
          it(`has a label text`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `#BirthMonth-label-text`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });

          it(`has a birth month INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#BirthMonth-input[type='text'][name='BirthMonth']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });
        });

        it(`has a birth day LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `label#BirthDay-label`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });

        describe(`birth day LABEL element`, () => {
          it(`has a label text`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `#BirthDay-label-text`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });

          it(`has a birthday INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#BirthDay-input[type='text'][name='BirthDay']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });
        });

        it(`has a birth day LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `label#BirthDay-label`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
        });

        describe(`birth year LABEL element`, () => {
          it(`has a label text`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `#BirthYear-label-text`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });

          it(`has a birth year INPUT element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(
              `input#BirthYear-input[type='text'][name='BirthYear']`,
              view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
          });
        });
      });

      it(`has a telephone number LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`label#TelephoneNumber-label`, view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
      });

      describe(`telephone number LABEL element`, () => {
        it(`has a label text`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `#TelephoneNumber-label-text`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });

        it(`has a telephone number INPUT element`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `input#TelephoneNumber-input[type='tel'][name='TelephoneNumber']`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });
      });

      it(`has a postal code LABEL element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`label#PostalCode-label`, view);

            assert.strictEqual(matches.length, 1);
            done();
          })
            .catch(done);
      });

      describe(`postal code LABEL element`, () => {
        it(`has a label text`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `#PostalCode-label-text`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });

        it(`has a postal code INPUT element`, (done) => {
        const sinks: UserRegistrationSinks = userRegistrationFixture();

        sinks.DOM.observe((view: VNode) => {
          const matches = domSelect(
            `input#PostalCode-input[type='text'][name='PostalCode']`,
            view);

          assert.strictEqual(matches.length, 1);
          done();
        })
          .catch(done);
        });
      });

      it(`has a submit BUTTON element`, (done) => {
          const sinks: UserRegistrationSinks = userRegistrationFixture();

          sinks.DOM.observe((view: VNode) => {
            const matches = domSelect(`button#Submit-button[type='submit']`, view);

            assert.strictEqual(matches.length, 1);
            assert.strictEqual(matches[0].text, `Sign Up`);
            done();
          })
            .catch(done);
      });
    });
  });
});

function userRegistrationFixture() {
  return UserRegistration();
}
