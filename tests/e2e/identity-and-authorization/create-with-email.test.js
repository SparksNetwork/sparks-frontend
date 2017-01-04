"use strict";
var e2e_common_1 = require("../../e2e-common");
var EMAIL_AND_PASSWORD_TEST_EMAIL = process.env.EMAIL_AND_PASSWORD_TEST_EMAIL;
function execTest(browser) {
    browser
        .url('http://localhost:8080/connect')
        .waitForElementVisible('#page', 12000) // wait for the page to display
        .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
        .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_EMAIL)
        .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
        .pause(6000) // give it time to redirect
        .assert.urlContains('dash') // we are on the dashboard page
        .end();
}
module.exports = {
    before: e2e_common_1.deleteFirebaseUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
    after: e2e_common_1.deleteFirebaseUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
    'IDENT UAT 3: Create with email': execTest
};
