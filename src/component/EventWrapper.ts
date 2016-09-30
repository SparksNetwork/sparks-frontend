import {not, keys, assoc, lensPath, set, view} from 'ramda';
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

function attachEvents(node:VNode, subject) {
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

function walkTree(subject, root:VNode):VNode {
  const children = (root.children || [])
      .filter(child => typeof child === 'object')
      .map(child => walkTree(subject, child as VNode));

  return assoc('children',
    children,
    attachEvents(root, subject));
}

interface WrappedEvents {
  DOM:Stream<VNode>
  events:Stream<NamedEvent>
}

export function EventWrapper(vnodeStream:Stream<any>):WrappedEvents {
  const eventSubject = subject<NamedEvent>();

  const DOM = vnodeStream.map(vnode => {
    return walkTree(eventSubject, vnode);
  });

  return {
    DOM,
    events: eventSubject
  }
}