import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler, useEffect, useRef } from 'react';

type Props = {
  className?: string;
  onClick: EventHandler<undefined>;
  disabled?: boolean;
  autoFocus?: boolean;
  dark?: boolean;
  lazyAutoFocus?: number;
};

const ButtonSquare: React.FC<Props> = ({
  disabled,
  className,
  children,
  onClick,
  autoFocus,
  lazyAutoFocus,
  dark,
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
      ref={ref}
      onClick={onClick}
      className={`${className || ''} ${modButton.button} ${
        modButton.buttonSquare
      } ${dark ? modButton.buttonDark : ''}`}
      disabled={disabled}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
};

export { ButtonSquare };
