import { Component, Sources } from '../component/types';
import { MainSources } from '../page/main';
import firebase = require('firebase');

import { Stream, just } from 'most';
import hold from '@most/hold';
import { ifElse, Arity1Fn } from 'ramda';

const ifBool = (_if: Arity1Fn, _else: Arity1Fn) => ifElse(Boolean, _if, _else);

export function user(sources: MainSources, next: (sources: Sources) => any) {
  const userProfileKey$: Stream<number> = sources.auth$.map(
    ifBool(({ uid }) => sources.firebase('Users', uid), () => just(null)))
    .switch()
    .thru(hold);

  const userProfile$: Stream<firebase.UserInfo> = userProfileKey$
    .skipRepeats()
    .map(ifBool(key => sources.firebase('Profiles', key), () => just(null)))
    .switch()
    .thru(hold);
}
