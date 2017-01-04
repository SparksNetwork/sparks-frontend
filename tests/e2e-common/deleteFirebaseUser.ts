import './initialize';
import * as admin from 'firebase-admin';
import {createUser} from './createFirebaseUser';

export function deleteIfExistsAndRecreateUser(email: string, pwd: string) {
  deleteUserAndReturnPromise(email)
    .then(() => createUser(email, pwd));
}
