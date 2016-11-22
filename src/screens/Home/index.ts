import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';
import { AuthenticationType } from '../../drivers/firebase-authentication';
import { FacebookAuthenticationButton, GoogleAuthenticationButton } from '../../components';
import { mergeSinks } from '../../helpers';

export interface HomeSources {
  dom: DOMSource;
}

export interface HomeSinks {
  dom: Stream<VNode>;
  authentication$: Stream<AuthenticationType>;
}

export function Home(sources: HomeSources): HomeSinks {
  const children: Array<HomeSinks> =
    [
      GoogleAuthenticationButton(sources),
      FacebookAuthenticationButton(sources),
    ];

  return mergeSinks(children, 'sparks-home');
};