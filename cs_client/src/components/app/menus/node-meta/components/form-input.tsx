import * as React from 'react';
import { MutableRefObject, useState } from 'react';
import { modNodeMeta, modTextInput } from '::sass-modules/index';

type Props = {
  type: 'checkbox' | 'text';
  label: string;
  defaultValue: string | boolean;
  inputRef?: MutableRefObject<HTMLInputElement>;
  additionalInput?: ({ disabled: boolean }) => JSX.Element;
};

const FormInput: React.FC<Props> = ({
  type,
  label,
  defaultValue,
  inputRef,
  additionalInput,
}) => {
  const inputName = label.replace(/[^A-Za-z]/g, '-').toLowerCase();
  const [value, setValue] = useState(defaultValue);
  const onChangeCheckbox = e => setValue(e.target.checked);
  const onChangeText = e => setValue(e.target.value);

  return (
    <label htmlFor={inputName} className={modNodeMeta.nodeMeta__input}>
      <span className={modNodeMeta.nodeMeta__input__label}>{label}</span>
      <input
        className={`${modTextInput.textInput} ${
          type === 'text'
            ? modNodeMeta.nodeMeta__input__textInput
            : modNodeMeta.nodeMeta__input__checkbox
        }`}
        type={type}
        name={inputName}
        // @ts-ignore
        value={value}
        onChange={type === 'checkbox' ? onChangeCheckbox : onChangeText}
        {...(type === 'checkbox' && {
          defaultChecked: defaultValue as boolean,
        })}
        ref={inputRef}
      />
      {additionalInput ? additionalInput({ disabled: !value }) : <></>}
    </label>
  );
};

export { FormInput };
