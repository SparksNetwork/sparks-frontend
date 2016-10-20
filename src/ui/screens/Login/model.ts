export interface GoogleAuthenticationRequest {
  method: 'GOOGLE';
};

export interface FacebookAuthenticationRequest {
  method: 'FACEBOOK';
}

export interface EmailAndPasswordAuthenticationRequest {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export type AuthenticationRequest =
  GoogleAuthenticationRequest |
  FacebookAuthenticationRequest |
  EmailAndPasswordAuthenticationRequest;

export function model(authenticationRequest: AuthenticationRequest) {
  return {
    authenticationMethod: authenticationRequest
  };
}