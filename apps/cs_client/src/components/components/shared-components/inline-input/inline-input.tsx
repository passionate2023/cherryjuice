import * as React from 'react';
import {
  joinClassNames,
  useClickOutsideModal,
  useOnKeyPress,
} from '@cherryjuice/shared-helpers';
import mod from './inline-input.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  CheckValidity,
  OnAcceptInput,
} from '::shared-components/inline-input/hooks/inline-input-provider';
import {
  onPaste,
  putCursor,
} from '::shared-components/inline-input/helpers/on-paste';

type Props = {
  initialValue: string;
  className?: string;
  onAcceptInput: OnAcceptInput;
  checkValidity: CheckValidity;
};
export const InlineInput: React.FC<Props> = ({
  checkValidity,
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
  useOnKeyPress({ ref, onClick: acceptInput, keys: ['Enter', 'Escape'] });
  useLayoutEffect(() => {
    setValid(value === initialValue ? true : checkValidity(value));
  }, [value]);
  useEffect(() => {
    ref.current.innerHTML = value;
    ref.current.focus();
    putCursor(ref.current, value.length);
  }, []);
  return (
    <span
      {...clkOProps}
      onPaste={onPaste}
      contentEditable={true}
      className={joinClassNames([
        className,
        mod.inlineInput,
        [mod.inlineInputInvalid, !valid],
      ])}
      role={'textarea'}
      onKeyUp={() => setValue(ref.current.innerText)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      ref={ref}
      onDoubleClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
};
