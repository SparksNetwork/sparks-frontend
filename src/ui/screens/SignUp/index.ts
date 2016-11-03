
import { Sources } from '../../../components/types';
import { DOMSource } from '@motorcycle/dom';
import { UserRegistration } from '../../components';
import { screen, ScreenSinks } from '../../wrappers';
import isolate from '@cycle/isolate';

type SignUpSinks = ScreenSinks;

type SignUpSources = Sources & {
  DOM: DOMSource;
};

function SignUp(sources: SignUpSources): SignUpSinks {
  return UserRegistration(sources);
}

export function SignUpScreen(sources) {
  return isolate(screen(SignUp))(sources);
}
