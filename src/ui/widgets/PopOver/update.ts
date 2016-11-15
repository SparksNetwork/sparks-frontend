import { Message } from './message$';
import { PopOverModel } from './';

type WrapperStyle =
  {
    top: string | number;
    left: string | number;
    width: string | number;
  };

export function update(message: Message): PopOverModel {
  const direction: 'top' | 'bottom' = 'top';
  const align: 'center' | 'left' | 'right' = 'center';

  const wrapperStyle: WrapperStyle = computeWrapperStyle(message);

  const model: PopOverModel =
    {
      id: ``,
      message: `temporary message`,
      direction,
      align,
      wrapperStyle
    }

  return model;
}

function computeWrapperStyle(message: Message): WrapperStyle {
  const { containerRect } = message;

  Function.prototype(containerRect);

  const wrapperStyle: WrapperStyle =
    {
      top: 0,
      left: `90%`,
      width: `300px`
    };

  return wrapperStyle;
}
