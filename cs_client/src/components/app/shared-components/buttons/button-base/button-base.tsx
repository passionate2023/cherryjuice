import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler, useEffect, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';

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
}) => {
  const ref = useRef<HTMLButtonElement>();
  useEffect(() => {
    if (lazyAutoFocus) {
      const handle = setTimeout(() => ref.current.focus(), lazyAutoFocus);
      return () => clearTimeout(handle);
    }
  }, []);
  return (
    <button
      className={joinClassNames([
        className,
        modButton.button,
        [modButton.buttonDark, dark],
        [modButton.buttonText, text],
        [modButton.buttonPressed, active],
      ])}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      {...(testId && { 'data-testid': testId })}
    >
      {icon}
      {text}
    </button>
  );
};

export { ButtonBase };
export { ButtonBaseProps };
