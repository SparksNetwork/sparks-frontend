module.exports = {
  'src_folders': ['tests/.tmp/e2e'],
  'output_folder': 'report',

  test_workers: false,

  'test_settings': {
    'default': {
      'launch_url': 'http://localhost:8080',
      'selenium_port': 80,
      'selenium_host': 'ondemand.saucelabs.com',
      'silent': true,
      'screenshots': {
        'enabled': false,
        'path': '',
      },
      'username': '${SAUCE_USERNAME}',
      'access_key': '${SAUCE_ACCESS_KEY}',

      'desiredCapabilities': {
        'name': 'Cycle Diversity Tests',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'tunnel-identifier': '${TRAVIS_JOB_NUMBER}',
        'initialBrowserUrl': 'http://localhost:8080',
      },

      'globals': {
        'waitForConditionTimeout': 30000,
      },
    },

    'android': {
      'desiredCapabilities': {
        'name': 'Android 5.1',
        'browserName': 'Browser',
        'appiumVersion': '1.5.3',
        'deviceName': 'Android Emulator',
        'deviceType': 'phone',
        'deviceOrientation': 'portrait',
        'platformVersion': '5.1',
        'platformName': 'Android',
      },
    },

    'iphone': {
      'desiredCapabilities': {
        name: 'iPhone 6 Plus',
        browserName: 'Safari',
        appiumVersion: '1.6.3',
        deviceName: 'iPhone Simulator',
        deviceOrientation: 'portrait',
        platformVersion: '10.0',
        platformName: 'iOS',
      },
    },

    'safari': {
      'desiredCapabilities': {
        'name': 'Safari',
        'browserName': 'safari',
        'platform': 'macOS 10.12',
        'version': '10.0',
      },
    },
  },

};
