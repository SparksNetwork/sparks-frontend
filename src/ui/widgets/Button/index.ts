import { VNode, DOMSource } from '@motorcycle/dom';
import { Stream, just } from 'most';
import { merge } from 'ramda';
import { combineObj } from '../../../helpers';
import { view, ViewSpecs } from './view';

export type ButtonSources = {
  DOM: DOMSource;
  attrs$?: Stream<ButtonAttrs>;
  children$?: Stream<ButtonChildren>;
};

export type ButtonSinks = {
  DOM: Stream<VNode>;
}

export type ButtonAttrs = {
  id?: string;
};

export type ButtonChildren = Array<VNode | string>;

export function Button(sources: ButtonSources): ButtonSinks {
  const sourcesWithDefaults: ButtonSources =
    sourcesWithAppliedDefaults(sources);

  const { attrs$, children$ } = sourcesWithDefaults;

  const state$: Stream<ViewSpecs> =
    combineObj<ViewSpecs>({ attrs$, children$ });

  return {
    DOM: state$.map(view)
  };
}

function sourcesWithAppliedDefaults(sources: ButtonSources): ButtonSources {
  return merge(sources, {
    attrs$: attrsWithDefaults$(sources),
    children$: childrenWithDefaults$(sources)
  });
}

function attrsWithDefaults$(sources: ButtonSources): Stream<ButtonAttrs> {
  const { attrs$ = just({}) } = sources;
  const defaultAttrs: ButtonAttrs =
    {
      id: ``
    };

  return attrs$.map(attrs => merge(defaultAttrs, attrs));
}

function childrenWithDefaults$(sources: ButtonSources): Stream<ButtonChildren> {
  const { children$ = just([]) } = sources;

  return children$;
}
