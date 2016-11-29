declare module 'nightwatch' {
  export interface PageObjects {
    signin(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  url: 'localhost:8080/signin',
  elements: {
    googleButton: {
      selector: '.c-btn-federated--google',
    },
  },
};
