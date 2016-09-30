import {not, keys, assoc, lensPath, set, view, curry} from 'ramda';
import {Stream} from "most";
import {VNode} from "@motorcycle/dom";
import {subject, Subject} from "most-subject";

interface NamedEvent extends Event {
  name:string
}

const onLens = lensPath(['data', 'on']);

function handler(subject:Subject<NamedEvent>, name:string) {
  return function(evt:NamedEvent) {
    evt.name = name;
    subject.next(evt)
  }
}

function attachEvents(subject:Subject<NamedEvent>, node:VNode) {
  const on = view(onLens, node);
  if (not(on)) { return node }
  const events = keys(on);

  const newOn = events.reduce((acc, event) => {
    const name:string|Function = on[event];
    const eventHandler = typeof name === 'string' ?
      handler(subject, name) :
      name;

    return assoc(event, eventHandler, acc);
  }, {});

  return set(onLens, newOn, node);
}

const walkTree = curry<Subject<NamedEvent>, VNode, VNode>(function(subject, root:VNode):VNode {
  const children = (root.children || [])
      .filter(child => typeof child === 'object')
      .map(walkTree(subject));

  return assoc('children',
    children,
    attachEvents(subject, root))
});

interface WrappedEvents {
  DOM:Stream<VNode>
  events:Stream<NamedEvent>
}

export function EventWrapper(vnodeStream:Stream<any>):WrappedEvents {
  const eventSubject = subject<NamedEvent>();

  const DOM = vnodeStream
    .map<VNode>(walkTree(eventSubject));

  return {
    DOM,
    events: eventSubject
  }
}