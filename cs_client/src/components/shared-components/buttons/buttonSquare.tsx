import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler } from 'react';

type Props = {
  className: string;
  onClick: EventHandler<undefined>;
  disabled?: boolean;
};

const ButtonSquare: React.FC<Props> = ({
  disabled,
  className,
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} ${modButton.button} ${modButton.buttonSquare}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { ButtonSquare };
