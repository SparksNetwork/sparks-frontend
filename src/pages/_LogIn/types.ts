export const GOOGLE: 'GOOGLE' = 'GOOGLE';
export const FACEBOOK: 'FACEBOOK' = 'FACEBOOK';
export { EMAIL_AND_PASSWORD } from '../../drivers/firebase-authentication';
export {makeFirebaseAuthenticationDriver} from '../../drivers/firebase-authentication/makeFirebaseAuthenticationDriver';
export * from './types';
export * from './AuthenticationError';

export type GoogleAuthenticationMethod = {
  method: 'GOOGLE';
};

export type FacebookAuthenticationMethod = {
  method: 'FACEBOOK';
}

export type EmailAndPasswordAuthentincationMethod = {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export type AuthenticationMethod =
  GoogleAuthenticationMethod |
    FacebookAuthenticationMethod |
    EmailAndPasswordAuthentincationMethod;
