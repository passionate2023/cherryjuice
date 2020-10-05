import * as React from 'react';
import { modTextInput } from '::sass-modules';
import { useCallback } from 'react';

export type ValidatedTextInputProps = {
  label: string;
  variableName?: string;
  required?: boolean;
  value?: string;
  onChange?: (string) => void;
  disabled?: boolean;
  min: number;
  max: number;
};

const NumberInput: React.FC<ValidatedTextInputProps & {}> = ({
  label,
  required,
  value,
  onChange,
  disabled,
  min,
  max,
}) => {
  const onChangeM = useCallback(e => {
    onChange(e.target.value);
  }, []);
  return (
    <input
      className={`${modTextInput.numberInput}`}
      type={'number'}
      min={min}
      max={max}
      required={required}
      aria-label={label}
      disabled={disabled}
      value={value}
      onChange={onChangeM}
    />
  );
};

export { NumberInput };
