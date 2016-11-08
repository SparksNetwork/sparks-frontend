export * from './types';
import { PopOverSinks } from './';
import { view } from './view';
import { just } from 'most';

export function PopOver(): PopOverSinks {
  return {
    DOM: just(view())
  };
}
