# ADR 1: User profile and authentication

## Participants
- Bruno Olivier Couriol <bcouriol@sparks.network>
- Frederik Krautwald <fkrautwald@sparks.network>
- Tylor Steinberger <tsteinberger@sparks.network>
- Stephen DeBaun <sdebaun@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

Currently, user data is received through the authentication driver. 
```
type AuthenticationOutput = {
  error: AuthenticationError | null;
  userCredential: firebase.auth.UserCredential;
};
```

There is a pending proposed modification of the authentication driver which 
if accepted will remove the responsibility of holding user data from the auth 
driver. 

It is proposed to modelize the user profile data as a behavior (in the FRP 
terminology) changed by authentication events (log-in, log-out, password reset, email changes, etc.). As such, the following is necessary :

1. a `authStateChanged` driver 
2. the injection at the application top level of the behavior constructed 
from the events from `authStateChanged`

### `authStateChanged` driver
This cycle driver would execute firebase auth `onAuthStateChanged` (cf. 
notes), and register a listener which will emits its `firebase.user` parameter 

### User profile behavior
Derived from `authStateChanged$` (lack of a better name), and any other 
relevant source (authentication driver results to include the credentials 
obtained from logging through google/facebook/etc. providers?)

### Injection into components
This behaviour should be injected into all components of the application. A 
generic combinator `InjectSources` could be used to that effect.

For example,
```
function InjectSources(injectedSources, [childComponent]) {
  return function (sources) {
    const mergedSources = merge(sources, injectedSources)

    return childComponent(mergedSources)
  }
} 
```
used as 
```
  const page = InjectSources({
    user$: computeUserBehavior(sources),
    routes$: just(routes)
  }, [
    ComponentRouter
  ]);
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

**PENDING**

## Consequences

**PENDING**

## Notes
- firebase API relevant docs :
  - https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
  - https://firebase.google.com/docs/reference/js/firebase.User
