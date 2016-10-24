require('ts-node').register(require('../tsconfig.json'))
require('buba/register')

const config = process.env.LOCAL
  ? require('./nightwatch_local.json')
  : require('./nightwatch_sauce.json')

module.exports = (function (settings) {
  if (process.platform === 'win32') {
    settings.selenium.cli_args['webdriver.chrome.driver'] =
      './node_modules/.bin/chromedriver.cmd'
  }
  if (process.env.SELENIUM_HOST) {
    settings.selenium.host = process.env.SELENIUM_HOST;
  }
  if (process.env.SELENIUM_PORT) {
    settings.selenium.host = process.env.SELENIUM_PORT;
  }

  return settings
})(config)
