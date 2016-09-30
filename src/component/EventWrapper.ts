import {not, keys, prop, assoc, lensPath, set, view} from 'ramda';
import {Stream, switchLatest} from "most";
import {VNode} from "@motorcycle/dom";
import {subject, Subject} from "most-subject";

interface NamedEvent extends Event {
  name:string
}

const onLens = lensPath(['data', 'on']);

function handler(subject:Subject<NamedEvent>, name:string) {
  return function(evt:NamedEvent) {
    evt.preventDefault();
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
  const eventStreams = vnodeStream.map(vnode => {
    const events = subject<NamedEvent>();
    const DOM = walkTree(events, vnode);

    events.observe(evt => {
      console.log('evt before switch', evt);
    });

    return {DOM, events}
  });

  const DOM = eventStreams.map<VNode>(prop('DOM'))
  const events = switchLatest(eventStreams.map<Stream<NamedEvent>>(prop('events')));

  events.observe(evt => {
    console.log('evt after switch', evt);
  });

  return {
    DOM,
    events
  }
}