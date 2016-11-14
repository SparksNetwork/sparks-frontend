# ADR 4: Constants and properties

## Participants
- Bruno Olivier Couriol <bcouriol@sparks.network>
- Frederik Krautwald <fkrautwald@sparks.network>
- Tylor Steinberger <tsteinberger@sparks.network>
- Stephen DeBaun <sdebaun@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

In the process of implementing feature specifications, there often pops up some constant values (ex: `MIN_PASSWORD_LENGTH`, `DASHBOARD_ROUTE`).

It is valuable first of all to use such constants to keep the code DRY, and then to keep track of these constants in one place for easy retrieval. Where a constant/property goes should be as close as possible as the feature it relates to without incurring into duplication. i.e. if a property is used by two features, that property should be help in a file which is a common ancestor of those two features in the directory tree.

The name `config.properties.ts` is suggested.

## Decision
PENDING

## Consequences
PENDING
