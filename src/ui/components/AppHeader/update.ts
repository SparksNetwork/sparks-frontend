import { Message } from './message$';
import { AppHeaderModel } from './';

export function update(message: Message): AppHeaderModel {
  const { transitionDuration, top, hasShadow } = message;

  const model: AppHeaderModel =
    {
      style: {
        transitionDuration,
        transform: `translate3d(0px, ${-top}px, 0px)`,
      },
      hasShadow,
    };

  return model;
}
