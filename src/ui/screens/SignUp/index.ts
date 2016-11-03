
import { Sources } from '../../../components/types';
import { DOMSource } from '@motorcycle/dom';
import { UserRegistration } from '../../components/UserRegistration';
import { screen, ScreenSinks } from '../../components/wrappers/screen';
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
