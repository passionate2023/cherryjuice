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
  useOnKeyPress({ ref, onClick: acceptInput, keys: ['Enter'] });
  useLayoutEffect(() => {
    setValid(value === initialValue ? true : checkValidity(value));
  }, [value]);
  useEffect(() => {
    ref.current.innerHTML = value;
    ref.current.focus();
    try {
      const range = document.createRange();
      range.setStart(ref.current.firstChild, value.length);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // eslint-disable-next-line no-empty
    } catch {}
  }, []);
  return (
    <span
      {...clkOProps}
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
