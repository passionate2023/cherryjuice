import * as React from 'react';
import modButton from './button-base.scss';
import {
  EventHandler,
  MouseEventHandler,
  MutableRefObject,
  useRef,
} from 'react';
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
  iconSize?: number;
  variant?: 'danger';
  _ref?: MutableRefObject<HTMLButtonElement>;
  onContextMenu?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: EventHandler<undefined>;
  onMouseLeave?: EventHandler<undefined>;
  'data-tooltip-id'?: string;
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
  _ref,
  text,
  active,
  icon,
  iconName,
  variant,
  small,
  onContextMenu,
  iconSize,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  _ref = _ref || buttonRef;
  useLazyAutoFocus(lazyAutoFocus, _ref);
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
      ref={_ref}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      onContextMenu={onContextMenu}
      onMouseLeave={props.onMouseLeave}
      onMouseEnter={props.onMouseEnter}
      data-tooltip-id={props['data-tooltip-id']}
      {...(testId && { 'data-testid': testId })}
    >
      {iconName ? (
        <Icon name={iconName} size={small ? 12 : iconSize} />
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
