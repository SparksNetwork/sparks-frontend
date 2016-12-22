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
    next: {
      selector: `#next`,
    },
    passwordField: {
      selector: `#Passwd`,
    },
    signIn: {
      selector: `#signIn`,
    },
  },
};
