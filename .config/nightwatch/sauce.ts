module.exports = {
  'src_folders': ['tests/.tmp'],
  'output_folder': 'report',

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
        'waitForConditionTimeout': 10000,
      },
    },

    'chrome49': {
      'desiredCapabilities': {
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '49',
      },
    },

    'chrome50': {
      'desiredCapabilities': {
        'name': 'Windows 10 - Chrome 50',
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '50',
      },
    },

    'chrome51': {
      'desiredCapabilities': {
        'name': 'Windows 10 - Chrome 51',
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '51',
      },
    },

    'firefox46': {
      'desiredCapabilities': {
        'name': 'Windows 10 - firefox 46',
        'browserName': 'firefox',
        'platform': 'Windows 10',
        'version': '46.0',
      },
    },

    'firefox47': {
      'desiredCapabilities': {
        'name': 'Windows 10 - firefox 47',
        'browserName': 'firefox',
        'platform': 'Windows 10',
        'version': '47.0',
      },
    },

    'ie9': {
      'desiredCapabilities': {
        'name': 'Windows 7 - IE9',
        'browserName': 'internet explorer',
        'platform': 'Windows 7',
        'version': '9.0',
      },
    },

    'ie10': {
      'desiredCapabilities': {
        'name': 'Windows 8 - IE10',
        'browserName': 'internet explorer',
        'platform': 'Windows 8',
        'version': '10.0',
      },
    },

    'ie11': {
      'desiredCapabilities': {
        'name': 'Windows 10 - IE11',
        'browserName': 'internet explorer',
        'platform': 'Windows 10',
        'version': '11.103',
      },
    },

    'edge': {
      'desiredCapabilities': {
        'name': 'Windows 10 - Microsoft Edge',
        'browserName': 'MicrosoftEdge',
        'platform': 'Windows 10',
        'version': '13.10586',
      },
    },

    'android42': {
      'desiredCapabilities': {
        'name': 'Android 4.2',
        'platform': 'linux',
        'version': '4.2',
        'deviceName': 'Samsung Galaxy S4 Emulator',
        'deviceOrientation': 'portrait',
      },
    },

    'android44': {
      'desiredCapabilities': {
        'name': 'Android 4.4',
        'browserName': 'Browser',
        'appiumVersion': '1.5.3',
        'deviceName': 'Android Emulator',
        'deviceType': 'phone',
        'deviceOrientation': 'portrait',
        'platformVersion': '4.4',
        'platformName': 'Android',
      },
    },

    'android51': {
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

    'iphone5': {
      'desiredCapabilities': {
        'name': 'iPhone 5 - iOS 8.4',
        'browserName': 'iPhone',
        'deviceOrientation': 'portrait',
        'deviceName': 'iPhone 5',
        'platform': 'OSX 10.11',
        'version': '8.4',
      },
    },

    'iphone6': {
      'desiredCapabilities': {
        'name': 'iPhone 6 - iOS 8.4',
        'browserName': 'iPhone',
        'deviceOrientation': 'portrait',
        'deviceName': 'iPhone 6',
        'platform': 'OSX 10.10',
        'version': '8.4',
      },
    },

    'iphone6plus': {
      'desiredCapabilities': {
        'name': 'iPhone 6 Plus - iOS 9.3',
        'browserName': 'Safari',
        'appiumVersion': '1.5.3',
        'deviceName': 'iPhone 6 Plus',
        'deviceOrientation': 'portrait',
        'platformVersion': '9.3',
        'platformName': 'iOS',
      },
    },

    'safari7': {
      'desiredCapabilities': {
        'name': 'Mac 10.9 - Safari 7.0',
        'browserName': 'safari',
        'platform': 'OS X 10.9',
        'version': '7.0',
      },
    },

    'safari8': {
      'desiredCapabilities': {
        'name': 'Mac 10.10 - Safari 8.0',
        'browserName': 'safari',
        'platform': 'OS X 10.10',
        'version': '8.0',
      },
    },

    'safari9': {
      'desiredCapabilities': {
        'name': 'Mac 10.11 - Safari 9.0',
        'browserName': 'safari',
        'platform': 'OS X 10.11',
        'version': '9.0',
      },
    },
  },

};
