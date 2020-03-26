import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler } from 'react';

type Props = {
  className: string;
  onClick: EventHandler<undefined>;
  disabled?: boolean;
  myref?: any;
};

const ButtonSquare: React.FC<Props> = ({
  disabled,
  className,
  children,
  onClick,
  myref,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} ${modButton.button} ${modButton.buttonSquare}`}
      disabled={disabled}
      {...(myref && { ref: myref })}
    >
      {children}
    </button>
  );
};

export { ButtonSquare };
