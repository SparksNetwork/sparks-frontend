import {merge} from 'ramda'
import {MainSources} from "../../page/main";
import {Sinks} from "../../component/types";

function authAction(auth) {
  return action => merge(action, {uid: auth.user.uid})
}

function queue$auth(queue$) {
  return auth => queue$.map(authAction(auth))
}

function queue$auth$({queue$, auth$}) {
  return auth$.map(queue$auth(queue$))
}

export function queue(sources: MainSources, next: Component<any, any>): Sinks {
  return merge(next(sources), {
    queue$: queue$auth$(sources).switch()
  })
}