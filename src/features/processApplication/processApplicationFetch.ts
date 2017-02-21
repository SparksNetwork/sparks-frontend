import { getInputValue } from '../../utils/dom';

//////
// Form data fetching

export function getAboutFormData(_?: any) {
  return {
    'superPower': getInputValue('.c-textfield__input--super-power'),
    'legalName': getInputValue('.c-textfield__input--legal-name'),
    'preferredName': getInputValue('.c-textfield__input--preferred-name'),
    'phone': getInputValue('.c-textfield__input--phone'),
    'birthday': getInputValue('.c-textfield__input--birthday'),
    'zipCode': getInputValue('.c-textfield__input--zip-code')
  }
}

export function getQuestionFormData(_?: any) {
  return {
    'answer': getInputValue('.c-textfield__input--answer'),
  }
}

