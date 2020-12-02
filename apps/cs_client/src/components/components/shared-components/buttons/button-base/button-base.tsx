import * as React from 'react';
import { modButton } from '::sass-modules';
import { EventHandler, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Icon } from '::root/components/shared-components/icon/icon';
import { useLazyAutoFocus } from '../hooks/lazy-auto-focus';

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
  iconName?: string;
  variant?: 'danger';
  small?: boolean;
};

const buttonVariants = {
  danger: modButton.buttonDanger,
};

const ButtonBase: React.FC<ButtonBaseProps> = ({
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
  comesFromUp,
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  useLazyAutoFocus(lazyAutoFocus, buttonRef, comesFromUp);
  return (
    <button
      className={joinClassNames([
        modButton.button,
        buttonVariants[variant],
        [modButton.buttonDark, dark],
        [modButton.buttonText, text],
        [modButton.buttonPressed, active],
        [modButton.buttonSmall, small],
        className,
      ])}
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      {...(testId && { 'data-testid': testId })}
    >
      {iconName ? (
        <Icon
          name={iconName}
          loadAsInlineSVG={'force'}
          size={small ? 12 : undefined}
        />
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
