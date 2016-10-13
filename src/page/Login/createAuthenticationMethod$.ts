import {
  AuthenticationMethod,
  EmailAndPasswordAuthentincationMethod,
  GOOGLE,
  FACEBOOK,
  EMAIL_AND_PASSWORD
} from '../../higher-order-components/authenticate';
import { Stream, merge, combine } from 'most';
import { DOMSource } from '@motorcycle/dom';

import {cssClasses} from '../../util/classes';
const classes = cssClasses({});

export function createAuthenticationMethod$(domSource: DOMSource):
    Stream<AuthenticationMethod> {
  const google$ = domSource.select(classes.sel('google')).events('click')
    .constant<AuthenticationMethod>({ method: GOOGLE });

  const facebook$ = domSource.select(classes.sel('facebook')).events('click')
    .constant<AuthenticationMethod>({ method: FACEBOOK });

  const email$ = domSource.select(classes.sel('login.email')).events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const password$ = domSource.select(classes.sel('login.password')).events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const emailAndPassword$ =
    combine<string, string, EmailAndPasswordAuthentincationMethod>(
      (email, password) => ({ method: EMAIL_AND_PASSWORD, email, password }),
      email$, password$
    );

  const submit$ = domSource.select('form').events('submit')
    .tap(ev => ev.preventDefault());

  const emailAndPasswordAuthenticationMethod$ = emailAndPassword$
    .sampleWith<EmailAndPasswordAuthentincationMethod>(submit$);

  return merge<AuthenticationMethod>(google$, facebook$)
    .merge(emailAndPasswordAuthenticationMethod$)
    .multicast();
}