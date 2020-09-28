import * as React from 'react';
import { modButton } from '::sass-modules';
import { EventHandler, MutableRefObject, useEffect, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Icon } from '::root/components/shared-components/icon/icon';

type ButtonBaseProps = {
  className?: string;
  onClick?: EventHandler<undefined>;
  disabled?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  lazyAutoFocus?: number;
  testId?: string;
  active?: boolean;
  text?: string;
  icon?: JSX.Element;
  iconName?: string;
  variant?: 'danger';
};

const buttonVariants = {
  danger: modButton.buttonDanger,
};

const useLazyAutoFocus = (
  lazyAutoFocus: number,
  elementRef: MutableRefObject<HTMLElement>,
) => {
  const focusTimeout = useRef<any>();
  useEffect(() => {
    if (elementRef.current)
      if (lazyAutoFocus) {
        clearTimeout(focusTimeout.current);
        focusTimeout.current = setTimeout(() => {
          elementRef.current.focus();
        }, lazyAutoFocus);
        return () => {
          elementRef.current.blur();
          clearTimeout(focusTimeout.current);
        };
      } else {
        elementRef.current.blur();
        clearTimeout(focusTimeout.current);
      }
  }, [lazyAutoFocus]);
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
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  useLazyAutoFocus(lazyAutoFocus, buttonRef);
  return (
    <button
      className={joinClassNames([
        modButton.button,
        buttonVariants[variant],
        [modButton.buttonDark, dark],
        [modButton.buttonText, text],
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
        <Icon name={iconName} loadAsInlineSVG={'force'} />
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
