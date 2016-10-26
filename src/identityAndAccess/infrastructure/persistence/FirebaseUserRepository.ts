/// <reference path="../../../../typings/index.d.ts" />
import { UserRepository, UserCandidate, User, UserId, EmailAddress }
  from '../../domain/model/identity/'
import firebase = require('firebase');

export class FirebaseUserRepository
  implements UserRepository {

  add(userCandidate: UserCandidate): Promise<User> {
    const password: string = userCandidate.password();

    const firebaseUserPromise: firebase.Promise<firebase.User> =
      firebase.auth().createUserWithEmailAndPassword(
        userCandidate.emailAddress().address(),
        password
      );

    return userPromise(firebaseUserPromise, password);
  }

  userFromAuthenticCredentials(
      emailAddress: EmailAddress,
      password: string): Promise<User> {

    const firebaseUserPromise: firebase.Promise<firebase.User> =
      firebase.auth().signInWithEmailAndPassword(
        emailAddress.address(), password
      );

    return userPromise(firebaseUserPromise, password);
  }
}

function userPromise(
    firebaseUserPromise: firebase.Promise<firebase.User>,
    password: string): Promise<User> {

  return new Promise<User>((resolve, reject) => {
    firebaseUserPromise
      .then((firebaseUser: firebase.User) => {
        resolve(new User(
          new UserId(firebaseUser.uid),
          new EmailAddress(firebaseUser.email as string),
          password
        ));
      })
      .catch(reject);
  });
}
