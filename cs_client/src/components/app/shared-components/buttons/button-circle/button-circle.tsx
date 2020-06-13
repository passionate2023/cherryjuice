import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler } from 'react';

type Props = {
  className?: string;
  onClick?: EventHandler<undefined>;
  disabled?: boolean;
};

const ButtonCircle: React.FC<Props> = ({
  className,
  children,
  onClick,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${modButton.button} ${modButton.buttonCircle}`}
    >
      {children}
    </button>
  );
};

export { ButtonCircle };
