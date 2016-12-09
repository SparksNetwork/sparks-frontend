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

## Environment Variables

The current environment variables that the application needs in order to run.

#### Firebase-related

These variables can be found by clicking "Add Firebase to your web app" on
the overview of your firebase application page.

- **FIREBASE_DATABASE_URL**
  - URL the point to your Firbase database usually looks like https://*application-name*.firebaseio.com
- **FIREBASE_API_KEY**
  - Unique API key from Firebase.
- **FIREBASE_AUTH_DOMAIN**
  - Where Firebase communicates to various authentication endpoints from usually looking like *application-name*.firebaseapp.com
- **FIREBASE_STORAGE_BUCKET**
  - Where your Firebase Storage is location usually looks like *application-name*.appspot.com
- **FIREBASE_MESSAGING_SENDER_ID**
  - A unique key firebase uses to associate push notifications to your application.

#### Integration-test-related

- **GOOGLE_TEST_EMAIL**
  - Must be a valid Google email address. If you are a Sparks.Network team member feel free to reach out for test account credentials.
- **GOOGLE_TEST_EMAIL_PASSWORD**
  - Must be a valid Google email password. If you are a Sparks.Network teaem member feel free to reach out for test account credentials.