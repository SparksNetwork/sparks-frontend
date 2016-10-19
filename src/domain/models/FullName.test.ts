/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { FullName } from './FullName';

describe(`domain/models`, () => {
  describe(`FullName`, () => {
    it(`should be a function`, () => {
      assert(typeof FullName === `function`);
    });

    it(`should set first name to simple name, given first name is simple name`, () => {
      assertSetFirstName(`Name`);
    });

    it(`should throw, given first name is empty`, () => {
      assert.throws(
        () => sutFixture(``),
        /word/
      );
    });

    it(`should throw, given first name length is greater than 200 characters`, () => {
      assert.throws(
        () => sutFixture(
          `Abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmno`
        )
      );
    });

    it(`should throw, given first name starts with whitespace`, () => {
      assert.throws(
        () => sutFixture(` Name`)
      );
    });

    it(`should throw, given first name ends with whitespace`, () => {
      assert.throws(
        () => sutFixture(`Name `)
      );
    });

    it(`should throw, given first name as multi-word`, () => {
      assert.throws(
        () => sutFixture(`Name Name`)
      );
    });

    it(`should set first name with unicode characters, given first name with unicode characters`, () => {
      assertSetFirstName(`Ωμέγα`);
    });

    it(`should set first name with initial unicode title case letter, given first name with initial unicode title case letter`, () => {
      assertSetFirstName(`ǈiljana`);
    });

    it(`should set first name Chinese, given first name is Chinese`, () => {
      assertSetFirstName(`陳大文`);
    });

    // Last name

    it(`should set last name to simple name, given last name is simple name`, () => {
      assertSetLastName(`Name`);
    });

    it(`should throw, given last name is empty`, () => {
      assert.throws(
        () => lastNameFixture(``),
        /empty/
      );
    });

    it(`should throw, given last name length is greater than 200 characters`, () => {
      assert.throws(
        () => lastNameFixture(
          `Abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmn` +
          `abcdefghijklmnopqrstuvwxyzabcdefghijklmno`
        )
      );
    });

    it(`should throw, given last name starts with whitespace`, () => {
      assert.throws(
        () => lastNameFixture(` Name`)
      );
    });

    it(`should throw, given last name ends with whitespace`, () => {
      assert.throws(
        () => lastNameFixture(`Name `)
      );
    });

    it(`should set last name as multi-word, given last name as multi-word`, () => {
      assertSetLastName(`Name Name`);
    });

    it(`should set last name with unicode characters, given last name with unicode characters`, () => {
      assertSetFirstName(`Ωμέγα`);
    });

    it(`should set last name with initial unicode title case letter, given last name with initial unicode title case letter`, () => {
      assertSetFirstName(`ǈiljana`);
    });

    it(`should set last name Chinese, given last name is Chinese`, () => {
      assertSetFirstName(`陳大文`);
    });
  });
});

function sutFixture(firstName: string, lastName: string = `Name`): FullName {
  return new FullName(firstName, lastName);
}

function assertSetFirstName(firstName: string) {
  const sut = sutFixture(firstName);
  assert.equal(sut.firstName(), firstName);
}

function assertSetLastName(lastName: string) {
  const sut = lastNameFixture(lastName);
  assert.equal(sut.lastName(), lastName);
}

function lastNameFixture(lastName: string) {
  return sutFixture(`Name`, lastName);
}
