declare module 'nightwatch' {
  export interface PageObjects {
    facebookOauth(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  elements: {
    emailField: {
      selector: `#email`,
    },
    passwordField: {
      selector: `#pass`,
    },
    submitButton: {
      selector: `button[type=submit]`,
    },
  },
};
