declare module 'nightwatch' {
  export interface PageObjects {
    dashboard(): {
      navigate(): NightWatchBrowser;
    };
  }
}

export = {
  url: `localhost:8080/dash`,
  elements: {
    page: `#dashboard`,
    userEmail: {
      selector: `#user-email`,
    },
  },
};
