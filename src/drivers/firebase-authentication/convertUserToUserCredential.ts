import firebase = require('firebase');

export function convertUserToUserCredential(provider: firebase.auth.AuthProvider) {
  return function (user: firebase.User): firebase.auth.UserCredential {
    return {
      user,
      credential: { provider: provider.providerId },
    };
  };
}
