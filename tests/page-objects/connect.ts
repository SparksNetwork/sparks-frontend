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
    signInLink: {
      selector: `a[href^='/signin']`,
    },
    errorField : {
      selector : '.c-textfield.c-textfield--errorfield',
    },
},
};
