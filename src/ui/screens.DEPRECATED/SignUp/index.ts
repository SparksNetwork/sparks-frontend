import { Sources } from '../../../components/types';
import { DOMSource } from '@motorcycle/dom';
import { UserRegistration, UserRegistrationSinks } from '../../components';
import { Stream } from 'most';
import { Views, ViewModel, view } from './view';
import { combineObj } from '../../../helpers/mostjs/combineObj';
import { screen, ScreenSinks } from '../../wrappers';
import isolate from '@cycle/isolate';

type SignUpSinks = ScreenSinks;

type SignUpSources = Sources & {
  DOM: DOMSource;
};

function SignUp(sources: SignUpSources): SignUpSinks {
  const userRegistration: UserRegistrationSinks = UserRegistration(sources);

  const views$: Stream<Views> =
    combineObj<Views>({
      userRegistration$: userRegistration.DOM
    });

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({
      views$
    });

  return {
    DOM: viewModel$.map(view)
  };
}

export function SignUpScreen(sources) {
  return isolate(screen(SignUp))(sources);
}
