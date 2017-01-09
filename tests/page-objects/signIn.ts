declare module 'nightwatch' {
  export interface PageObjects {
    signIn(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  url: 'http://localhost:8080/signin',
  elements: {
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
    emailField: {
      selector: `.c-textfield__input--email`,
    },
    invalidEmailField: {
      selector: `.c-textfield__input--email:invalid`,
    },
    passwordField: {
      selector: `.c-textfield__input--password`,
    },
    invalidPasswordField: {
      selector: `.c-textfield__input--password:invalid`,
    },
    submitButton: {
      selector: `.c-btn.c-btn--primary.c-sign-in__submit`,
    },
  },
};
