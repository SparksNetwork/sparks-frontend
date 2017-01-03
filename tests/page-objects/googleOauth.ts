declare module 'nightwatch' {
  export interface PageObjects {
    googleOauth(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  elements: {
    emailField: {
      selector: `#Email`,
    },
    nextButton: {
      selector: `#next`,
    },
    passwordField: {
      selector: `#Passwd`,
    },
    submitButton: {
      selector: `#signIn`,
    },
  },
};
