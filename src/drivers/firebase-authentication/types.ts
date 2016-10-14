import firebase = require('firebase');

export const ANONYMOUSLY: 'ANONYMOUSLY' = 'ANONYMOUSLY';
export const EMAIL_AND_PASSWORD: 'EMAIL_AND_PASSWORD' = 'EMAIL_AND_PASSWORD';
export const POPUP: 'POPUP' = 'POPUP';
export const REDIRECT: 'REDIRECT' = 'REDIRECT';
export const SIGN_OUT: 'SIGN_OUT' = 'SIGN_OUT';
export const CREATE_USER: 'CREATE_USER' = 'CREATE_USER';
export const GET_REDIRECT_RESULT: 'GET_REDIRECT_RESULT' = 'GET_REDIRECT_RESULT';

export interface AnonymousAuthenticationInput {
  method: 'ANONYMOUSLY';
}

export interface EmailAndPasswordAuthenticationInput {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export interface PopupAuthenticationInput {
  method: 'POPUP';
  provider: firebase.auth.AuthProvider;
}

export interface RedirectAuthenticationInput {
  method: 'REDIRECT';
  provider: firebase.auth.AuthProvider;
}

export interface SignOutAuthenticationInput {
  method: 'SIGN_OUT';
}

export interface CreateUserAuthenticationInput {
  method: 'CREATE_USER';
  email: string;
  password: string;
}

export interface GetRedirectResultAuthenticationInput {
  method: 'GET_REDIRECT_RESULT';
}

export type AuthenticationInput =
  AnonymousAuthenticationInput |
  EmailAndPasswordAuthenticationInput |
  PopupAuthenticationInput |
  RedirectAuthenticationInput |
  SignOutAuthenticationInput |
  CreateUserAuthenticationInput |
  GetRedirectResultAuthenticationInput;

export type AuthenticationOutput = {
  error: firebase.auth.Error | null;
  userCredential: firebase.auth.UserCredential;
};
