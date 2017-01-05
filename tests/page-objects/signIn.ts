import { PageObject, makePageObject } from '../e2e-common/makePageObject';

declare module 'nightwatch' {
  export interface PageObjects {
    signIn(): PageObject;
  }
}

const elements =
  {
    page: `#page`,
    googleButton: {
      selector: '.c-btn-federated--google',
    },
    facebookButton: {
      selector: '.c-btn-federated--facebook',
    },
    connectLink: {
      selector: `a[href^='/connect']`,
    },
    title: {
      selector: `.c-sign-in__title`,
    },
    emailLabel: {
      selector: `.c-sign-in__email .c-textfield__label`,
    },
    passwordLabel: {
      selector: `.c-sign-in__password .c-textfield__label`,
    },
    forgotPasswordLink: {
      selector: `.c-sign-in__password-forgot`,
    },
    signInButton: {
      selector: `.c-sign-in__submit`,
    }
  };

export = makePageObject(`/signin`, elements);
