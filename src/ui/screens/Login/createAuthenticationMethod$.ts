import { Stream, merge, combine } from 'most';
import { DOMSource } from '@motorcycle/dom';
import { AuthenticationRequest, EmailAndPasswordAuthenticationRequest, model } from './model';

import {cssClasses} from '../../helpers/cssClasses';
const classes = cssClasses({});

export function createAuthenticationMethod$(domSource: DOMSource):
    Stream<AuthenticationRequest> {
  const google$ = domSource.select(classes.sel('google')).events('click')
    .constant<AuthenticationRequest>({ method: 'GOOGLE' });

  const facebook$ = domSource.select(classes.sel('facebook')).events('click')
    .constant<AuthenticationRequest>({ method: 'FACEBOOK' });

  const email$ = domSource.select(classes.sel('login.email')).events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const password$ = domSource.select(classes.sel('login.password')).events('input')
    .map(ev => (ev.target as HTMLInputElement).value);

  const emailAndPassword$ =
    combine<string, string, EmailAndPasswordAuthenticationRequest>(
      (email, password) => ({ method: 'EMAIL_AND_PASSWORD', email, password }),
      email$, password$
    );

  const submit$ = domSource.select('form').events('submit')
    .tap(ev => ev.preventDefault());

  const emailAndPasswordAuthenticationMethod$ = emailAndPassword$
    .sampleWith<EmailAndPasswordAuthenticationRequest>(submit$);

  return merge<AuthenticationRequest>(google$, facebook$)
    .merge(emailAndPasswordAuthenticationMethod$)
    .map(model)
    .map(state => state.authenticationMethod)
    .multicast();
}
