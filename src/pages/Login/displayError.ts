import { label } from '@motorcycle/dom';

export function displayError(userExists: boolean | null) {
  return userExists === null || userExists
    ? null
    : label({ style: { color: 'red' } }, 'User does not exist!');
}
