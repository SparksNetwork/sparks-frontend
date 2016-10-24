# ADR 2: Modeling Domain Entities

Tylor Steinberger <tsteinberger@sparks.network>,
Frederik Krautwald <fkrautwald@sparks.network>

## Status

~~Proposed~~ | **Accepted** | ~~Depreciated~~ | ~~Superceded~~

## Context

Domain modeling in TypeScript has many different possible solutions. Here we
would like to decide the correct solution for our application.

1. **Define Classes to Model our Domain Entities or Value Objects.**
This may be okay because classes allow for inheritance. This may also be okay
because classes map to nouns which domain entities are described as. Classes are
also able to implement TypeScript interfaces which can be good for testing with
mocks. Classes also allow for optimization in instantiation when used many times in
current JavaScript engines. This may be not okay because it places focus on Entities
before behavior, and could place a tendency towards OOP, which by some is considered
an anti-pattern in Cycle applications.

2. **Define Domain Entities as Types or Interfaces only.**
This may be okay because Types and Interfaces map to nouns which domain entities
are described as. Interfaces and Types can be satisfied object literals. Interfaces
and Types are easy to replace with mocks for testing. Types and Interfaces only lean
towards a more functional approach to solutions.
This may not be okay because it does not allow for encapsulation, and loses the
opportunity to use inheritance.

3. **Define Domain Entities as Types or Interfaces with Immutable Object literals.**
This may be okay, or not okay, for all the reasons listed in option number 2.
It may also be okay because we get true immutability. It may also be not okay
because it will utilize a new dependency increasing built application size.

## Decision
We will define or Domain Entities as Classes optionally implementing Interfaces.

## Consequences
Entities are easily mapped to nouns.

Entities can implement TypeScript interfaces.

Easy to create mocks for testing.

Optimized for reoccurring instantiation.

Places tendency towards OOP when author is programming.