# ADR 1: Internationalization

Tylor Steinberger <tsteinberger@sparks.network>,
Frederik Krautwald <fkrautwald@sparks.network>

## Status

~~Proposed~~ | **Accepted** | ~~Depreciated~~ | ~~Superceded~~

## Context

The application needs to present strings in multiple languages based on user preferences.

1. DOM Module

  This may be okay because the translations are represented directly in the 
  views. This may not be okay because it couples the translations to our 
  virtual-DOM implementation. This may also not be okay because string 
  interpolation and manipulation may be complex. This may not be okay because 
  strings can not be used in other contexts, such as setting the 
  `document.title` or calling `console.log()`, etc. This may not be okay, 
  because it requires additional development efforts to create a module for 
  server-side rendering. This may also not be okay because it does not align 
  with our current approach for managing state with streams.

2. Motorcycle.js Driver

  This may be okay because translations are decoupled from the views. This may 
  also be okay because it is decoupled from the virtual-DOM implementation. 
  This may also be okay because string interpolation and manipulation is made 
  easy via streams. This may also be okay because strings can be used in other 
  contexts, such as setting the `document.title` or calling `console.log()`, 
  etc. This may also be okay because it is possible to reuse for server-side 
  rendering. This may also be okay because it aligns with our current approach 
  for managing state with streams. This may not be okay because it becomes more 
  complex to place translations into the view.

## Decision

We will develop a Motorcycle.js Driver for translations.

## Consequences

The translations will be decoupled from the views and virtual-DOM implementation.

String interpolation and manipulation will be done via streams.

Translations can be used in other contexts other than views.

Server-side rendering will be acheivable in the future.

Our translations will align with our approach for state.

Some overhead in getting translation into the view.