const URL = 'http://localhost:8080/login'
const FACEBOOK_TEST_EMAIL = process.env.FACEBOOK_TEST_EMAIL
const FACEBOOK_TEST_EMAIL_PASSWORD = process.env.FACEBOOK_TEST_EMAIL_PASSWORD

function containsText (element, text) {
  return '//' + element + '[text()="' + text + '"]'
}

describe('Logging in with Facebook', () => {
  it('should redirect to facebook login when clicking facebook button', (browser) => {
    browser.useXpath()
      .url(URL)
      .deleteCookies()
      .session('delete')
      .click(containsText('*', 'Login with Facebook'))
      .pause(5000)
      .assert.urlContains('www.facebook.com')
  })

  it('should allow entering email into input', (browser) => {
    browser.useCss()
      .waitForElementVisible('#email')
      .setValue('#email', FACEBOOK_TEST_EMAIL)
  })

  it('should allow entering password into input', (browser) => {
    browser.useCss()
      .waitForElementVisible('#pass')
      .setValue('#pass', FACEBOOK_TEST_EMAIL_PASSWORD)
      .click('#loginbutton')
      .end()
  })
})
