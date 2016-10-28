import { Stream } from 'most';
import {
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';

export type AuthenticationState = {
  isAuthenticated: boolean,
  authenticationError: AuthenticationError | null
}
