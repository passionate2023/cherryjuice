import * as React from 'react';
import { modNodeMeta, modTextInput } from '::sass-modules/index';
import { useEffect, useRef } from 'react';

type FormInputProps = {
  type?: 'checkbox' | 'text';
  label: string;
  testId?: string;
  onChange?: Function;
  value?;
  additionalInput?: JSX.Element;
  monolithComponent?: JSX.Element;
  lazyAutoFocus?: number;
  customInput?: JSX.Element;
};

const MetaFormInput: React.FC<FormInputProps> = ({
  type,
  label,
  onChange,
  value,
  additionalInput,
  lazyAutoFocus,
  testId,
  monolithComponent,
  customInput,
}) => {
  const inputName = label.replace(/[^A-Za-z]/g, '-').toLowerCase();
  const onChangeCheckbox = e => onChange(e.target.checked);
  const onChangeText = e => onChange(e.target.value);

  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (lazyAutoFocus) {
      const handle = setTimeout(() => {
        inputRef.current.focus();
        clearTimeout(handle);
      }, lazyAutoFocus);
      return () => {
        inputRef.current.blur();
        clearTimeout(handle);
      };
    }
  }, []);

  return monolithComponent ? (
    monolithComponent
  ) : (
    <label htmlFor={inputName} className={modNodeMeta.nodeMeta__input}>
      <span className={modNodeMeta.nodeMeta__input__label}>{label}</span>
      {customInput ? (
        customInput
      ) : (
        <input
          className={`${modTextInput.textInput} ${
            type === 'text'
              ? modNodeMeta.nodeMeta__input__textInput
              : modNodeMeta.nodeMeta__input__checkbox
          }`}
          ref={inputRef}
          type={type}
          name={inputName}
          {...{
            onChange: type === 'checkbox' ? onChangeCheckbox : onChangeText,
            [type === 'checkbox' ? 'checked' : 'value']: value,
          }}
          {...(testId && { 'data-testid': testId })}
        />
      )}
      {additionalInput ? additionalInput : <></>}
    </label>
  );
};

export { MetaFormInput };
export { FormInputProps };
