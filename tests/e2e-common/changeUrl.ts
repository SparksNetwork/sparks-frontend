export function changeUrl(url: string) {
  return function (languageCode: string = `en-US`) {
    return this.client.api.url(this.client.api.launch_url + `${url}?lang=${languageCode}`);
  };
}
