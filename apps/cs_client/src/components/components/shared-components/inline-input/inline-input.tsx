import * as React from 'react';
import {
  joinClassNames,
  useClickOutsideModal,
  useOnKeyPress,
} from '@cherryjuice/shared-helpers';
import mod from './inline-input.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  CheckValidity,
  OnAcceptInput,
} from '::shared-components/inline-input/hooks/inline-input-provider';

type Props = {
  autoFocus?: boolean;
  initialValue: string;
  className?: string;
  onAcceptInput: OnAcceptInput;
  checkValidity: CheckValidity;
  width?: number;
};
export const InlineInput: React.FC<Props> = ({
  checkValidity,
  autoFocus = true,
  onAcceptInput,
  initialValue,
  className,
  width,
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
      style={{ width }}
      value={value}
      onChange={e => setValue(e.target.value)}
      ref={ref}
      autoFocus={autoFocus}
      onDoubleClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
};
