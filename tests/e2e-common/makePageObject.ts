import { NightWatchBrowser } from 'nightwatch';
import { changeUrl } from './changeUrl';

export function makePageObject(url: string, elements: any = {}) {
  return {
    url: function () { return this.client.api.launch_url + url },
    elements,
    commands: [
      {
        changeUrl: changeUrl(url),
      },
    ],
  };
}

export interface PageObject {
  navigate(): NightWatchBrowser;
  changeUrl(language: string): NightWatchBrowser;
}
