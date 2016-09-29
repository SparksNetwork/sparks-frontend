import {MainSources} from '../../page/main'
import {Sinks} from '../../component/types'
import {Stream, just} from 'most'
import hold from '@most/hold';
import {merge} from 'ramda'

export function user(sources: MainSources, next: Component<any, any>): Sinks {
  const userProfileKey$: Stream<number> = sources.auth$.map(
    ifBool(({ uid }) => sources.firebase('Users', uid), () => just(null)))
    .switch()
    .thru(hold);

  const userProfile$: Stream<firebase.UserInfo> = userProfileKey$
    .skipRepeats()
    .map(ifBool(key => sources.firebase('Profiles', key), () => just(null)))
    .switch()
    .thru(hold);

  return next(merge(sources, { userProfile$, userProfileKey$ }));
}