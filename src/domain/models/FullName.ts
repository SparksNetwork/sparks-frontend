const FAILURE_ARGUMENT_FIRST_NAME_LENGTH_RANGE =
  `First name must be 200 characters or less.`;

const FAILURE_ARGUMENT_LAST_NAME_LENGTH_RANGE =
  `Last name must be 200 characters or less.`;

const FAILURE_ARGUMENT_FIRST_NAME_FORMAT =
  `First name must be a single word without whitespaces.`;

const FAILURE_ARGUMENT_LAST_NAME_FORMAT =
  `Last name must not be empty or start or end with whitespaces.`;

const FIRST_NAME_LENGTH_MINIMUM = 1;

const FIRST_NAME_LENGTH_MAXIMUM = 200;

const LAST_NAME_LENGTH_MINIMUM = 1;

const LAST_NAME_LENGTH_MAXIMUM = 200;

const RE_FIRST_NAME = /^[^0-9\s]+$/;

const RE_LAST_NAME = /^[^0-9\s]+( [^0-9\s]+)*$/;

export class FullName {
  private _firstName: string;

  private _lastName: string;

  constructor(firstName: string, lastName: string) {
    this.setFirstName(firstName);
    this.setLastName(lastName);
  }

  firstName(): string {
    return this._firstName;
  }

  lastName(): string {
    return this._lastName;
  }

  private setFirstName(firstName: string) {
    guardFirstName(firstName);
    this._firstName = firstName;
  }

  private setLastName(lastName: string) {
    guarLastName(lastName);
    this._lastName = lastName;
  }
}

function guardFirstName(firstName: string) {
  assertStringMatchesPattern(firstName,
    RE_FIRST_NAME,
    FAILURE_ARGUMENT_FIRST_NAME_FORMAT);

  assertStringLengthIsWithinRange(firstName,
    FIRST_NAME_LENGTH_MINIMUM,
    FIRST_NAME_LENGTH_MAXIMUM,
    FAILURE_ARGUMENT_FIRST_NAME_LENGTH_RANGE);
}

function guarLastName(lastName: string) {
  assertStringMatchesPattern(lastName,
    RE_LAST_NAME,
    FAILURE_ARGUMENT_LAST_NAME_FORMAT);

  assertStringLengthIsWithinRange(lastName,
    LAST_NAME_LENGTH_MINIMUM,
    LAST_NAME_LENGTH_MAXIMUM,
    FAILURE_ARGUMENT_LAST_NAME_LENGTH_RANGE);
}

// @TODO Move assertion functions below to a core repo/directory.

function assertStringLengthIsWithinRange(
    string: string,
    minimum: number = 0,
    maximum: number = NaN,
    message: string = ``): boolean {
  const length = string.length;
  if (length < minimum || length > maximum) {
    throw new Error(message);
  }

  return true;
}

function assertStringMatchesPattern(
    string: string,
    pattern: RegExp,
    message: string = ``): boolean {
  if (!pattern.test(string)) {
    throw new Error(message);
  }

  return true;
}