import * as React from 'react';
import modButtonCircle from './button-circle.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import {
  ButtonBase,
  ButtonBaseProps,
} from '::root/buttons/button-base/button-base';

export type ButtonCircleProps = {
  rotated45?: boolean;
  small?: boolean;
};

const ButtonCircle: React.FC<ButtonBaseProps & ButtonCircleProps> = args => {
  return (
    <ButtonBase
      {...args}
      className={joinClassNames([
        args.className,
        modButtonCircle.buttonCircle,
        [modButtonCircle.buttonCircleSmall, args.small],
        [modButtonCircle.buttonCircleRotated45, args.rotated45],
      ])}
    />
  );
};
ButtonCircle.displayName = 'ButtonCircle';
export { ButtonCircle };
