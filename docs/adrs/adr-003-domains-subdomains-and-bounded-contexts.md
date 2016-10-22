# ADR 003: Domains, Subdomains, and Bounded Contexts

Tylor Steinberger <tsteinberger@sparks.network>,
Frederik Krautwald <fkrautwald@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

### Definitions

**Domain** A Domain, in the broad sense, is what the organization does and what 
it does it in. The organization has its own unique realm of know-how and way of 
conducting business. That realm of understanding and its methods for carrying 
out its operations is its Domain.

**Subdomain** A Subdomain is an area within the organization’s domain. The 
Domain is, thus, made up of Subdomains. A Subdomain could for example be an 
Invoicing Subdoman, an Order Subdomain, or an Inventory Subdomain. 

**Bounded Context** A Bounded Context is defining relationships between the 
Subdomains. For example, a Bounded Context could be a Sales Context or a Support 
Context. Bounded Contexts have both unrealted concepts (such as a support ticket 
only exists in a customer support context) but also share concepts (such as 
products and customers).

### Challenge: Identitfy Subdomains and Bounded Contexts

Total unification of the domain model for a large system is not feasible or 
cost-effective (covered by Eric Evans in his book _Domain-Driven Design_). 
Thus, we must break our domain model into models concerned with their specific 
areas. By defining these Bounded Contexts for our models, we eliminate 
intertwining details that would potentially ripple through a model when details 
change.

It should be clear that identity and access is entirely unrelated to a 
collaboration between volunteers and organizers. Surely, the software has users, 
and users must be distinguished from one another to determine which tasks each 
can perform. But collaboration tools should be interested in the roles of the 
users rather than who they specifically are and each little action they are 
permitted to perform.

We need to decide where these different Bounded Context projects should live.

1. **A Bounded Context gets its own repository.** This may be okay, because 
there’s a clear separation between Bounded Contexts. It also allows 
collaborators to work within each Bounded Context and making decisions that do 
not directly affect a unified repository. It may not be so okay, because 
maintenance of dependencies increase with each added repository.

2. **A Bounded Context live in its own directory in a shared repository.** 
This may be okay, because ...

## Decision

We have identified _Identity and Access Context_ for the Bounded Context that 
contains the model of the identity and access project.

## Consequences
