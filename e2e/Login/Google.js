const URL = 'http://localhost:8080/login'
const GOOGLE_TEST_EMAIL = process.env.GOOGLE_TEST_EMAIL
const GOOGLE_TEST_EMAIL_PASSWORD = process.env.GOOGLE_TEST_EMAIL_PASSWORD

function containsText (element, text) {
  return '//' + element + '[text()="' + text + '"]'
}

describe('Logging in with Google', () => {
  it('should redirect to google login when clicking google button', (browser) => {
    browser
      .url(URL)
      .deleteCookies()
      .useXpath()
      .click(containsText('*', 'Login with Google'))
      .pause(5000)
      .assert.urlContains('accounts.google.com')
  })

  it('should allow entering email into input', (browser) => {
    browser.useCss()
      .waitForElementVisible('#Email')
      .setValue('#Email', GOOGLE_TEST_EMAIL)
      .click('#next')
  })

  it('should allow entering password into input', (browser) => {
    browser.useCss()
      .waitForElementVisible('#Passwd')
      .setValue('#Passwd', GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .end()
  })
})
