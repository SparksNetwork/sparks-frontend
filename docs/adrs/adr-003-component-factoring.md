# ADR 3: Page factoring

Bruno Olivier Couriol <bcouriol@sparks.network>,

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

A systematic factoring could go a long way in order to accelerate the production, documentation, reading, navigation and maintenance of pages.

Cycle made popular the so-called MVI factoring which distinguishes three entities (model, view, intent) and segregates each concern into dedicated functions. Some of these functions are pure, which facilitates testing, one is impure but is easily testable through DOM mocking.

In the current state of the development of the application, pages are constructed in an ad-hoc manner, specific to each particular page. This allows for flexibility and greater adaptability to the logic enclosed in the page.

The proposed factoring makes use of :

- higher order components, which are functions whose signature includes (but is not restricted to) an array of components and returns a component
- a View/Intent/Action breakdown of the component

An example being better than many words, follows the source code from a working demo of factoring of the login page : 

```javascript
export const LogInComponent = LogInActions({
  // compute the extra sources for downstream components
  fetch: computeAuthenticationSources,
  // merge children components sinks representing actions :
  // - route redirection
  // - DOM updates
  merge: computeAuthenticationSinks
}, [
  LogInIntents({
    'google@click': LogInWithGoogleIntent('google$'),
    'facebook@click': LogInWithFacebookIntent('facebook$'),
    'form@submit': LogInWithEmailIntent('emailAndPasswordAuthenticationInput$'),
    'cancel@click': CancelIntent('cancel$'),
  }, [
    LogInView
  ])
])

export default sources => isolate(LogInComponent)(sources);
```

The directory structure could include :

```
pages --- LogIn --- index.ts
                 |- types.ts
                 |- LogInView.ts
                 |- LogInIntents.ts
                 |- LogInActions.ts
```

In summary, options are :

| Option | +/- | Description |
| -------------  | ----- | :-------------|
| ad-hoc | `+` | Flexibility and adaptability to page logic|
|  | `-` | - Can lead to a source base which is harder to navigate and maintain |
| HOC VIA | `+` | Locating (navigation) ; Adding/Removing/Updating (maintenance) ; - Understanding behavior (reading) ; Documenting are made easy by separating the structure from the details|
| HOC VIA | `+` | Utility functions can be factored out and tested once and for all, diminishing the tests' surface and writing time |
| HOC VIA | `+` | Testing smaller blocks allows for easily idenfying the source of bugs. Using pure functions allows for independent and parallelized testing |
| HOC VIA | `-` | Initial learning time |
|---

## Decision


## Consequences

