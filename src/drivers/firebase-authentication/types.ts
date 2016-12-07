import firebase = require('firebase');
import { AuthenticationError } from './AuthenticationError';

export const ANONYMOUSLY: 'ANONYMOUSLY' = 'ANONYMOUSLY';
export const EMAIL_AND_PASSWORD: 'EMAIL_AND_PASSWORD' = 'EMAIL_AND_PASSWORD';
export const POPUP: 'POPUP' = 'POPUP';
export const REDIRECT: 'REDIRECT' = 'REDIRECT';
export const SIGN_OUT: 'SIGN_OUT' = 'SIGN_OUT';
export const CREATE_USER: 'CREATE_USER' = 'CREATE_USER';
export const GET_REDIRECT_RESULT: 'GET_REDIRECT_RESULT' = 'GET_REDIRECT_RESULT';

export interface AnonymousAuthentication {
  method: 'ANONYMOUSLY';
}

export interface EmailAndPasswordAuthentication {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export interface PopupAuthentication {
  method: 'POPUP';
  provider: firebase.auth.AuthProvider;
}

export interface RedirectAuthentication {
  method: 'REDIRECT';
  provider: firebase.auth.AuthProvider;
}

export interface SignOutAuthentication {
  method: 'SIGN_OUT';
}

export interface CreateUserAuthentication {
  method: 'CREATE_USER';
  email: string;
  password: string;
}

export interface GetRedirectResultAuthentication {
  method: 'GET_REDIRECT_RESULT';
}

export type AuthenticationType =
  AnonymousAuthentication |
  EmailAndPasswordAuthentication |
  PopupAuthentication |
  RedirectAuthentication |
  SignOutAuthentication |
  CreateUserAuthentication |
  GetRedirectResultAuthentication;

export type Authentication = {
  error: AuthenticationError | null;
  userCredential: firebase.auth.UserCredential;
};

