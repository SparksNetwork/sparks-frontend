/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { UserRepository, UserCandidate, User, UserId, EmailAddress }
  from '../../domain/model/identity/'
import firebase = require('firebase');

declare const Sparks;
firebase.initializeApp(Sparks.firebase);

describe(`firebase user repository`, function () {

  describe(`add`, function () {

    class FirebaseUserRepository
      implements UserRepository {

      add(userCandidate: UserCandidate): Promise<User> {
        const firebaseUserPromise: firebase.Promise<firebase.User> =
          firebase.auth().createUserWithEmailAndPassword(
            userCandidate.emailAddress().address(),
            userCandidate.password()
          );

        return new Promise<User>((resolve, reject) => {
          firebaseUserPromise
            .then((firebaseUser: firebase.User) => {
              resolve(new User(
                new UserId(firebaseUser.uid),
                new EmailAddress(firebaseUser.email as string)
              ));
            })
            .catch(reject);
        })
      }
    }

    it(`returns a registered user`, function (done) {
      this.timeout(3000);

      let emailAddress = `test@sparks.network`;
      let password = `secret`;
      const firebaseUserPromise: firebase.Promise<any> =
        firebase.auth().signInWithEmailAndPassword(emailAddress, password);

      firebaseUserPromise
        .then((user: firebase.User) => {
          return user.delete().catch(done);
        })
        .catch(() => Promise.resolve()) // We know now that user doesn’t exist
        .then(() => {
          const repo: FirebaseUserRepository = new FirebaseUserRepository();

          const userCandidate: UserCandidate = new UserCandidate(
            new EmailAddress(emailAddress),
            password
          );

          const userPromise: Promise<User> = repo.add(userCandidate);

          userPromise.then((user) => {
            assert.strictEqual(user.emailAddress().address(), emailAddress);
            done();
          });
        });
    });
  });
});
