import * as React from 'react';
import { modButton } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';
import {
  ButtonBase,
  ButtonBaseProps,
} from '::root/components/shared-components/buttons/button-base/button-base';

const ButtonCircle: React.FC<ButtonBaseProps> = args => {
  return (
    <ButtonBase
      {...args}
      className={joinClassNames([modButton.buttonCircle, args.className])}
    />
  );
};
ButtonCircle.displayName = 'ButtonCircle';
export { ButtonCircle };
