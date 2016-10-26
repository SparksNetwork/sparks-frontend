/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserCandidate, User, EmailAddress }
  from '../../domain/model/identity/';
import { FirebaseUserRepository } from './';
import firebase = require('firebase');

declare const Sparks;
firebase.initializeApp(Sparks.firebase);

describe(`firebase user repository`, function () {
  this.timeout(5000);

  const emailAddress: string = `test@sparks.network`;
  const password: string = `secret`;
  const repo: FirebaseUserRepository = new FirebaseUserRepository();

  let firebaseUserPromise: firebase.Promise<firebase.User>;

  beforeEach(() => {
    firebaseUserPromise =
      firebase.auth().signInWithEmailAndPassword(emailAddress, password);
  });

  describe(`add`, function () {
    it(`returns a registered user`, function (done) {
      const userCandidate: UserCandidate = new UserCandidate(
        new EmailAddress(emailAddress),
        password
      );

      firebaseUserPromise
        .then((user: firebase.User) => {
          return user.delete().catch(done);
        })
        .catch(() => Promise.resolve()) // We know now that user doesn’t exist
        .then(() => {
          const userPromise: Promise<User> = repo.add(userCandidate);

          userPromise.then((user) => {
            assert.strictEqual(user.emailAddress().address(), emailAddress);
            done();
          });
        });
    });
  });

  describe(`userFromAuthenticCredentials`, () => {
    it(`returns a user with given authentic credentials`, (done) => {
      firebaseUserPromise
        .catch(() => firebase.auth().createUserWithEmailAndPassword(emailAddress, password))
        .then(() => repo.userFromAuthenticCredentials(
          new EmailAddress(emailAddress), password))
        .then((user: User) => {
          assert.strictEqual(user.emailAddress().address(), emailAddress);
          done();
        })
        .catch(done);
    });
  });
});
