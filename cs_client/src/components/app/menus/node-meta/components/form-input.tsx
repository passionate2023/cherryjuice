import * as React from 'react';
import { modNodeMeta, modTextInput } from '::sass-modules/index';

type Props = {
  type: 'checkbox' | 'text';
  label: string;
  onChange: Function;
  value;
  additionalInput?: ({ disabled: boolean }) => JSX.Element;
};

const FormInput: React.FC<Props> = ({
  type,
  label,
  onChange,
  value,
  additionalInput,
}) => {
  const inputName = label.replace(/[^A-Za-z]/g, '-').toLowerCase();
  const onChangeCheckbox = e => onChange(e.target.checked);
  const onChangeText = e => onChange(e.target.value);

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
        {...{
          onChange: type === 'checkbox' ? onChangeCheckbox : onChangeText,
          [type === 'checkbox' ? 'checked' : 'value']: value,
        }}
      />
      {additionalInput ? additionalInput({ disabled: !value }) : <></>}
    </label>
  );
};

export { FormInput };
