declare module 'nightwatch' {
  export interface PageObjects {
    connect(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  url: 'http://localhost:8080/connect',
  elements: {
    page: `#page`,
    googleButton: {
      selector: `.c-btn-federated--google`,
    },
    facebookButton: {
      selector: `.c-btn-federated--facebook`,
    },
    emailField: {
      selector: `.c-textfield__input--email`,
    },
    passwordField: {
      selector: `.c-textfield__input--password`,
    },
    submitButton: {
      selector: `.c-btn.c-btn--primary.c-sign-in__submit`,
    },
    signInLink: {
      selector: `a[href^='/signin']`,
    },
    firebaseEmailField: {
      selector: '.c-textfield__input--email'
    },
    firebasePasswordField: {
      selector: '.c-textfield__input--password'
    },
    firebaseSubmitButton: {
      selector : '.c-btn.c-btn--primary.c-sign-in__submit'
    },
  },
};
