import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { joinClassNames } from '::helpers/dom/join-class-names';
import {
  ButtonBase,
  ButtonBaseProps,
} from '::shared-components/buttons/button-base/button-base';

const ButtonSquare: React.FC<ButtonBaseProps> = args => {
  return (
    <ButtonBase
      {...args}
      className={joinClassNames([modButton.buttonSquare, args.className])}
    />
  );
};

export { ButtonSquare };
