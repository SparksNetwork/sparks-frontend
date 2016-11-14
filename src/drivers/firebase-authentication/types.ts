import firebase = require('firebase');
import {AuthenticationError} from './AuthenticationError';

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

export interface PasswordResetAuthenticationInput {
  method: 'SEND_PASSWORD_RESET_EMAIL';
  email: string;
}

export type AuthenticationInput =
  AnonymousAuthenticationInput |
    EmailAndPasswordAuthenticationInput |
    PopupAuthenticationInput |
    RedirectAuthenticationInput |
    SignOutAuthenticationInput |
    CreateUserAuthenticationInput |
    GetRedirectResultAuthenticationInput |
    PasswordResetAuthenticationInput;

export type AuthenticationOutput = {
  // TODO : optional properties for now, pending adr decision, string is
  // now, number what we want
  method? : number | string;
  result? : any;
  error: AuthenticationError | null;
  // TODO : kept now but should remove when adrs accepted
  userCredential: firebase.auth.UserCredential;
};
