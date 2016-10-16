export interface GoogleAuthenticationRequest {
  method: 'google';
};

export interface FacebookAuthenticationRequest {
  method: 'facebook';
}

export interface EmailAndPasswordAuthenticationRequest {
  method: 'emailAndPassword';
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