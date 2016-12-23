import { NightWatchBrowser } from 'nightwatch';

export function pages(client: NightWatchBrowser): any {
  const pages: any =
    {
      'Google': client.page.googleOauth(),
      'Facebook': client.page.facebookOauth(),
      'Connect': client.page.connect(),
    };

  return pages;
}

export const emails: any =
  {
    'Google': process.env.GOOGLE_TEST_EMAIL,
    'Facebook': process.env.FACEBOOK_TEST_EMAIL,
    'email and password': process.env.EMAIL_AND_PASSWORD_TEST_EMAIL
  };

export const passwords: any =
  {
    'Google': process.env.GOOGLE_TEST_EMAIL_PASSWORD,
    'Facebook': process.env.FACEBOOK_TEST_EMAIL_PASSWORD,
    'email and password': process.env.EMAIL_AND_PASSWORD_TEST_EMAIL_PASSWORD
  };

export const connectElements: any =
  {
    'Google': `@googleButton`,
    'Facebook': `@facebookButton`,
  };
