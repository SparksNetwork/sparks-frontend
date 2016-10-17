const URL = 'http://localhost:8080/login'
const EMAIL_AND_PASSWORD_EMAIL_TEST_EMAIL = process.env.EMAIL_AND_PASSWORD_TEST_EMAIL
const EMAIL_AND_PASSWORD_EMAIL_TEST_PASSWORD = process.env.EMAIL_AND_PASSWORD_TEST_PASSWORD

function containsText (element, text) {
  return '//' + element + '[text()="' + text + '"]'
}

describe('Logging in with Email and Password', () => {
  it('should allow entering email into input', (browser) => {
    browser
      .url(URL)
      .deleteCookies()
      .session('delete')
      .useCss()
      .waitForElementVisible('input[type="email"]')
      .setValue('input[type="email"]', EMAIL_AND_PASSWORD_EMAIL_TEST_EMAIL)
  })

  it('should allow entering password into input', (browser) => {
    browser.useCss()
      .waitForElementVisible('input[type="password"]')
      .setValue('input[type="password"]', EMAIL_AND_PASSWORD_EMAIL_TEST_PASSWORD)
      .useXpath()
      .click(containsText('*', 'Submit'))
      .end()
  })
})
