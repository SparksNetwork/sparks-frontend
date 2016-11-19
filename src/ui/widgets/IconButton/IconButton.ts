import {
  IconButtonSinks, IconButtonSources, IconButtonProps, IconButtonModel
} from './';
import { Icon, IconSinks, IconSources, IconProps } from '../';
import { combineObj } from '../../../helpers';
import { Stream } from 'most';
import { VNode } from '@motorcycle/dom';
import { view } from './view';

type ModelProps =
  {
    props: IconButtonProps,
    icon: VNode,
  };

export function IconButton(sources: IconButtonSources): IconButtonSinks {
  const { props$ } = sources;

  const icon$: Stream<VNode> = makeIcon(sources).dom;

  const model$: Stream<IconButtonModel> =
    combineObj<ModelProps>({ props$, icon$ })
      .map(modelProps => {
        const { props, icon } = modelProps;
        const { className = `` } = props;

        return { className, icon };
      });

  return {
    dom: model$.map(view),
  };
}

function makeIcon(iconButtonSources: IconButtonSources): IconSinks {
  const { dom, props$: iconButtonProps$ } = iconButtonSources;

  const props$: Stream<IconProps> =
    iconButtonProps$
      .map(props => {
        const { src = ``, icon = `` } = props;

        return { src, icon };
      });

  const sources: IconSources =
    { dom, props$ };

  return Icon(sources);
}
