import * as React from 'react';
import { modButton } from '::sass-modules/index';
import { EventHandler, useEffect, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Icon } from '::shared-components/icon/icon';

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
        modButton.button,
        [modButton.buttonDark, dark],
        [modButton.buttonText, text],
        [modButton.buttonPressed, active],
        className,
      ])}
      ref={ref}
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

export { ButtonBase };
export { ButtonBaseProps };
