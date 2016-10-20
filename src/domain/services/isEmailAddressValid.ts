const START_POSITION = 0;
const NO_INDEX = -1;
const MINIMUM_CHARACTER_COUNT_BEFORE_LAST_DOT = 3;
const MINIMUM_TLD_CHARACTER_COUNT = 2;

export function isEmailAddressValid(address: string): boolean {
    var lastAtPosition = address.lastIndexOf(`@`);
    var lastDotPosition = address.lastIndexOf(`.`);
    return (lastAtPosition < lastDotPosition
      && lastAtPosition > START_POSITION
      && address.indexOf(`@@`) === NO_INDEX
      && lastDotPosition >= MINIMUM_CHARACTER_COUNT_BEFORE_LAST_DOT
      && (address.length - lastDotPosition) > MINIMUM_TLD_CHARACTER_COUNT);
}
