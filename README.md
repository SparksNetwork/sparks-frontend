# Sparks.Network

> Frontend for Sparks.Network Volunteer Software

## Architectural Decision Records

We keep records of architectural decisions in [./docs/adrs/](./docs/adrs/).

## Styles

We use patternlab in sparks-design-system to create css styles for this project.  [See more info about patternlab and how to use it](http://patternlab.io/docs/index.html).

### Naming Conventions

* See [the BEM system](https://en.bem.info/methodology/quick-start/)
* [A good intro](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* [And then namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)

### Basic steps

1. Create sass/components/_components.foo.scss
2. Create _patterns/10-basics/foo/NN-foo-styles.mustache
3. Commit and push sparks-design-system
4. npm install to update

## Test Files in the `src` Directory

All files ending with `.test.ts` are unit tests for files of the same
corresponding name (neighbor).

All files ending with `.int-test.ts` are integration tests for files of the
same corresponding name (neighbor). Integration is abbreviated as _int_ to
avoid common typos.

## End-to-End Tests

You can run end to end tests using the command `npm run test:e2e`.

If you need to run only 1 of the tests you can use
```sh
npm run test:e2e -- --test ./tests/.tmp/e2e/name-of-test-file-name.js
```

To run the end-to-end tests, you need to ensure that the following steps have 
been completed.

1. Goto https://console.firebase.google.com/

2. Choose **sparks-integration-test**

3. Click the cog wheel next to **Overview** and choose **Project Settings**

4. Click tab **SERVICE ACCOUNTS**

5. In Firebase Admin SDK, click **GENERATE NEW PRIVATE KEY**. This will 
   download a JSON file with the service account settings.

6. Open the JSON file.

7. For each key, add the key as an all-caps environment variable in the format:

   `FIREBASE_ADMINSDK_{KEY}`

   where `{KEY}` is the all-caps JSON key, assign it its corresponding value.

   IMPORTANT! The `private_key` value must be enclosed in single-quotes `'` and
   be immediately preceded by a `$`.

   Example:

   `export FIREBASE_ADMINSDK_PRIVATE_KEY=$'-----BEGIN PRIVATE KEY-----\nMIIEvQIB ... =\n-----END PRIVATE KEY-----\n'`

## Environment Variables

The current environment variables that the application needs in order to run.

#### Firebase-related

These variables can be found by clicking "Add Firebase to your web app" on
the overview of your firebase application page.

- **FIREBASE_DATABASE_URL**
  - URL the point to your Firbase database. Usually looks like https://*application-name*.firebaseio.com
- **FIREBASE_API_KEY**
  - Unique API key from Firebase.
- **FIREBASE_AUTH_DOMAIN**
  - Where Firebase communicates to various authentication endpoints. Usually looks like *application-name*.firebaseapp.com
- **FIREBASE_STORAGE_BUCKET**
  - Where your Firebase Storage is located. Usually looks like *application-name*.appspot.com
- **FIREBASE_MESSAGING_SENDER_ID**
  - A unique key firebase uses to associate push notifications to your application.

#### Integration-test-related

In all these cases you may use your own accounts.  For automated tests you
should use SN test account credentials.

- **GOOGLE_TEST_EMAIL**
  - Must be a valid Google email address.
- **GOOGLE_TEST_EMAIL_PASSWORD**
  - Must be a valid Google email password.
- **FACEBOOK_TEST_EMAIL**
  - Must be a email address for an existing Facebook account.
- **FACEBOOK_TEST_EMAIL_PASSWORD**
  - Must be the password for that Facebook account.
