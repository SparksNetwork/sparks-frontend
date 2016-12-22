require('nightwatch-cucumber')({
  nightwatchClientAsParameter: true,
  featureFiles: ['tests/.tmp/features'],
  stepDefinitions: ['tests/.tmp/features/step_definitions'],
});

const config = process.env.LOCAL
  ? require('./nightwatch/local.ts')
  : require('./nightwatch/sauce.ts');

export = (function (settings) {
  if (process.platform === 'win32')
    settings.selenium.cli_args['webdriver.chrome.driver'] =
      './node_modules/.bin/chromedriver.cmd';

  if (process.env.SELENIUM_HOST)
    settings.selenium.host = process.env.SELENIUM_HOST;


  if (process.env.SELENIUM_PORT)
    settings.selenium.host = process.env.SELENIUM_PORT;

  settings.page_objects_path = './tests/.tmp/page-objects';

  return settings;
})(config);
