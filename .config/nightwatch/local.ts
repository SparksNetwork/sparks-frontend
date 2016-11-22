const config = {
  src_folders: ['tests/.tmp/tests'],
  output_folder: './report',

  selenium: {
    start_process: true,
    server_path: 'node_modules/selenium-server/lib/runner/selenium-server-standalone-3.0.1.jar',
    log_path: '',
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
      'webdriver.ie.driver': '',
    },
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost:8080',
      selenium_port: 4444,
      selenium_host: 'localhost',
      output_folder: './report',
      screenshots: {
        enabled: true,
        path: '.screens',
        on_failure: true,
        on_error: true,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
      globals: {
        waitForConditionTimeout: 10000,
      },
    },
  },
};

export = config;
