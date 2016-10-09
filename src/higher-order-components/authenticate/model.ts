import { AuthenticationInput, AuthenticationMethod } from '../../driver/cyclic-fire';

export function model(authenticationMethod: AuthenticationMethod): AuthenticationInput {
  return {
    type: authenticationMethod === 'password' ? 'password' : 'redirect',
    method: authenticationMethod
  };
}
