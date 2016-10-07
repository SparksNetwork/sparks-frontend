import { AuthInput, Provider } from '../../driver/cyclic-fire';

export function model(action: string = ''): AuthInput {
  return {
    type: action === 'password' ? 'password' : 'redirect',
    provider: action as Provider
  };
}