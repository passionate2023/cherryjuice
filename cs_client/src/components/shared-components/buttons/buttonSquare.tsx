import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler, Ref } from 'react';

type Props = {
  className: string;
  onClick: EventHandler<undefined>;
  disabled?: boolean;
  myref?: Ref<any>;
  autoFocus?: boolean;
};

const ButtonSquare: React.FC<Props> = ({
  disabled,
  className,
  children,
  onClick,
  myref,
  autoFocus,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} ${modButton.button} ${modButton.buttonSquare}`}
      disabled={disabled}
      {...(myref && { ref: myref })}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
};

export { ButtonSquare };
