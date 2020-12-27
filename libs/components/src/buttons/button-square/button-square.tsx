import * as React from 'react';
import modButtonSquare from './button-square.scss';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import {
  ButtonBase,
  ButtonBaseProps,
} from '::root/buttons/button-base/button-base';

const ButtonSquare: React.FC<ButtonBaseProps> = args => {
  return (
    <ButtonBase
      {...args}
      className={joinClassNames([modButtonSquare.buttonSquare, args.className])}
    />
  );
};
ButtonSquare.displayName = 'ButtonSquare';
export { ButtonSquare };
