import * as React from 'react';
import {
  joinClassNames,
  useClickOutsideModal,
  useOnKeyPress,
} from '@cherryjuice/shared-helpers';
import mod from './inline-input.scss';
import { useLayoutEffect, useRef, useState } from 'react';
export type CheckValidity = (currentValue: string) => boolean;
type Props = {
  checkValidity: CheckValidity;
  autoFocus?: boolean;
  onAcceptInput: (value: string, isValid: boolean) => void;
  initialValue: string;
  className?: string;
};
export const InlineInput: React.FC<Props> = ({
  checkValidity,
  autoFocus = true,
  onAcceptInput,
  initialValue,
  className,
}) => {
  const [valid, setValid] = useState(true);
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>();
  useLayoutEffect(() => {
    setValid(value === initialValue ? true : checkValidity(value));
  }, [value]);

  const acceptInput = () => {
    onAcceptInput(value, valid);
  };

  const { clkOProps } = useClickOutsideModal({
    assertions: [],
    callback: acceptInput,
  });
  useOnKeyPress({ ref, onClick: acceptInput, keys: ['Enter'] });

  return (
    <input
      {...clkOProps}
      type="text"
      className={joinClassNames([
        className,
        mod.inlineInput,
        [mod.inlineInputInvalid, !valid],
      ])}
      value={value}
      onChange={e => setValue(e.target.value)}
      ref={ref}
      autoFocus={autoFocus}
    />
  );
};
