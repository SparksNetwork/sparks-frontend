import { IconSinks, IconSources, IconModel } from './';
import { view } from './view';
import { Stream } from 'most';
import { VNode, img, svg } from '@motorcycle/dom';

export function Icon(sources: IconSources): IconSinks {
  const child$: Stream<VNode> =
    sources.props$
      .map(props => {
        const { src = `` } = props;

        if (src)
          return makeImg(src);

        return svg();
      });

  const model$: Stream<IconModel> =
    child$
      .map(child => {
        return {
          child,
        }
      });

  return {
    dom: model$.map(view),
  }
}

function makeImg(src): VNode {
  return img(
    {
      props: {
        src,
        draggable: false,
      },
      style: {
        width: `100%`,
        height: `100%`,
      }
    });
}
