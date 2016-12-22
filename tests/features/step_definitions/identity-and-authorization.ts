import { NightWatchBrowser } from 'nightwatch';
import { deleteGoogleUser } from '../common';

export = function () {

  this.Given('I’m not connected with Google', function () {
    deleteGoogleUser();
  });

  this.When('I navigate to the connect URL', function (client: NightWatchBrowser) {
    const connect: any = client.page.connect();

    connect
      .navigate()
      .waitForElementVisible('@page');
  });

  this.When('I click Connect with Google', function (client: NightWatchBrowser) {
    const connect: any = client.page.connect();

    connect
      .click('@googleButton')
  });

  this.Then('I’m taken to Google OAuth form', function (client: NightWatchBrowser) {
    const googleOauth: any = client.page.googleOauth();

    googleOauth
      .waitForElementPresent('@emailField');
  });

  this.When('I enter my email', function (client: NightWatchBrowser) {
    const googleOauth: any = client.page.googleOauth();

    googleOauth
      .setValue('@emailField', process.env.GOOGLE_TEST_EMAIL);
  });

  this.When('I click Next', function (client: NightWatchBrowser) {
    const googleOauth: any = client.page.googleOauth();

    googleOauth
      .click('@next');
  });

  this.When('I enter my password', function (client: NightWatchBrowser) {
    const googleOauth: any = client.page.googleOauth();

    googleOauth
      .waitForElementPresent('@passwordField')
      .setValue('@passwordField', process.env.GOOGLE_TEST_EMAIL_PASSWORD);
  });

  this.When('I click Sign in', function (client: NightWatchBrowser) {
    const googleOauth: any = client.page.googleOauth();

    googleOauth
      .click('@signIn');
  });

  this.Then('I’m taken to the dashboard', function (client: NightWatchBrowser) {
    const dashboard: any = client.page.dashboard();

    dashboard
      .waitForElementPresent('@page');
  });

  this.Then('I am signed in', function (client: NightWatchBrowser) {
    const dashboard: any = client.page.dashboard();

    dashboard
      .waitForElementPresent('@userEmail');
  });

}
