import * as React from 'react';
import modButton from './button-base.scss';
import { EventHandler, useRef } from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';
import { useLazyAutoFocus } from '@cherryjuice/shared-helpers';
import { ButtonCircleProps } from '::root/buttons/button-circle/button-circle';
import { IconName } from '@cherryjuice/icons';

type ButtonBaseProps = {
  className?: string;
  onClick?: EventHandler<undefined>;
  disabled?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  lazyAutoFocus?: boolean;
  comesFromUp?: boolean;
  testId?: string;
  active?: boolean;
  text?: string;
  icon?: JSX.Element;
  iconName?: IconName;
  variant?: 'danger';
};

const buttonVariants = {
  danger: modButton.buttonDanger,
};

const ButtonBase: React.FC<ButtonBaseProps & ButtonCircleProps> = ({
  disabled,
  className,
  onClick,
  autoFocus,
  lazyAutoFocus,
  dark,
  testId,
  text,
  active,
  icon,
  iconName,
  variant,
  small,
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  useLazyAutoFocus(lazyAutoFocus, buttonRef);
  return (
    <button
      className={joinClassNames([
        modButton.button,
        buttonVariants[variant],
        [modButton.buttonDark, dark],
        [modButton.buttonText, !!text],
        [modButton.buttonPressed, active],
        className,
      ])}
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      {...(testId && { 'data-testid': testId })}
    >
      {iconName ? (
        <Icon name={iconName} size={small ? 12 : undefined} />
      ) : icon ? (
        icon
      ) : (
        <></>
      )}
      {text}
    </button>
  );
};

export { ButtonBase, useLazyAutoFocus };
export { ButtonBaseProps };
