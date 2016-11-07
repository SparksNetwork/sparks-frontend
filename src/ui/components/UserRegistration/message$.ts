import { UserRegistrationDefaultSources } from './';
import { Stream, merge } from 'most';
import { combineObj } from '../../../helpers/mostjs/combineObj';

export type Message = {
  passwordInputActive: boolean
};

export function message$(
  sources: UserRegistrationDefaultSources): Stream<Message> {

  const { DOM } = sources;

  const passwordInputFocus$: Stream<boolean> =
    DOM.select(`#UserRegistrationPasswordInput`).events(`focus`)
      .map(() => true);

  const passwordInputBlur$: Stream<boolean> =
    DOM.select(`#UserRegistrationPasswordInput`).events(`blur`)
      .map(() => false);

  const passwordInputActive$: Stream<boolean> =
    merge(passwordInputFocus$, passwordInputBlur$)
      .startWith(false);

  const message$: Stream<Message> =
    combineObj<Message>({ passwordInputActive$ })

  return message$;
}
