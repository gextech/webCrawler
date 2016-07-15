'use strict'
var argv =  require('minimist')(process.argv.slice(2)),
    nwrun = require('nwrun'),
    chromedriver = require('chromedriver');
var path = require('path');
nwrun({
  argv: argv,
  force: argv.force,
  target: ['dev'],
  standalone: argv.standalone,
  src_folders: process.cwd() + '/tests',
  output_folder: process.cwd() + '/reports',
  test_settings: {
   dev: {
        desiredCapabilities: {
          browserName:  'chrome',
        },
        cli_args: {
          'webdriver.chrome.driver': chromedriver.path
        },
        screenshots: {
          enabled: true,
          path: path.join(__dirname, '../screenshots')
        }
      }
  }
}, function(success) {
  if (!success) {
    process.exit(1);
  }
});
