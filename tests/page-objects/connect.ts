import { PageObject, makePageObject } from '../e2e-common/makePageObject';

declare module 'nightwatch' {
  export interface PageObjects {
    connect(): PageObject;
  }
}

const elements =
  {
    page: `#page`,
    googleButton: {
      selector: `.c-btn-federated--google`,
    },
    facebookButton: {
      selector: `.c-btn-federated--facebook`,
    },
    emailField: {
      selector: `#Email`,
    },
    passwordField: {
      selector: `#Passwd`,
    },
    submitButton: {
      selector: `#signIn`,
    },
    signInLink: {
      selector: `a[href^='/signin']`,
    },
  };

export = makePageObject('/connect', elements);
