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
