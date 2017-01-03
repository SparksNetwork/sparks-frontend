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
  },
};
