# ADR 1: Deploying Higher-Order Components

Tylor Steinberger <tsteinberger@sparks.network>,
Frederik Krautwald <fkrautwald@sparks.network>

## Status

~~Proposed~~ | **Accepted** | ~~Depreciated~~ | ~~Superceded~~

## Context

Higer-order components (HOC) are not components as traditional Cycle components
(TCC). HOC are functions that accepts a TCC, augments its sources or sinks,
and returns the augmented component.

Where HOCs should live in the code base came down to these choices:

1. **Alongside tradition Cycle components in the *components* directory.**
   This response may be OK, because a HOC accepts a TCC and its return value is
   an augmented component. Thus, HOCs are concextually coupled with TCCs. It
   may be not so good, however, because a HOC doesn’t have the same signature
   as a TCC, i.e., it doesn’t accept *sources*. Also, a HOC may be mistaken for
   a TCC.

2. **In a sub-directory of the *components* directory.**
   This may be fine, because HOCs are then concextually coupled with TCCs.
   This may be not so good, because it creates deeply-nested directories, which
   may be difficult to navigate, and imports will be longer.
   The sub-directory’s siblings will be actual TCCs, thus, the sub-directory
   could be difficult to locate among many TCCs.

3. **In the *utilities* directory.**
   This response may also be okay, because a HOC augments (a TCC). However, it
   may be not so good, because HOCs are conceptually coupled with TCCs, but the
   **utilities** directory doesn’t imply that. The HOCs would also live
   alongside other unrelated "utilities".

4. **In their own designated directory.**
   Again, this may also be okay, because all HOCs will be grouped in their own
   place. However, it may appear confusing that HOCs, which operate exclusively
   on TCCs and even return sinks of the TCCs, are separated from the TCCs.

## Decision

We will place HOCs under their own designated directory
`higherOrderComponents/higherOrderComponent`.

## Consequences

It is clear where HOCs live.

We avoid deeply-nested directories.

We avoid long imports.

We avoid difficulty locating HOCs among TCCs.

The contextual coupling between HOCs and TCCs may not be obvious.
