import * as React from 'react';
import mod from './validated-text-input.scss';
import { Icon } from '@cherryjuice/icons';
import { Ref } from 'react';
import {
  patternToString,
  TPattern,
} from '::root/inputs/validated-text-input/helpers/pattetn-to-string';
import { useCustomValidityMessage } from '::root/inputs/validated-text-input/hooks/custom-validation-message';

export type ValidatedTextInputProps = {
  label: string;
  inputRef: Ref<HTMLInputElement>;
  variableName?: string;
  type?: string;
  icon?: string | [string];
  ariaLabel?: string;
  minLength?: number;
  patterns?: TPattern[];
  required?: boolean;
  autoComplete?: boolean;
  idPrefix: string;
  value?: string;
  onChange?: (string) => void;
  setValid?: (boolean) => void;
  defaultValue?: string;
  disabled?: boolean;
  sendValidStatusWithValue?: boolean;
};

const ValidatedTextInput: React.FC<
  ValidatedTextInputProps & {
    highlightInvalidInput?: boolean;
  }
> = ({
  label,
  icon,
  ariaLabel,
  patterns = [],
  type = 'text',
  minLength = 0,
  required,
  inputRef,
  autoComplete,
  idPrefix,
  highlightInvalidInput = true,
  value,
  onChange,
  setValid,
  defaultValue,
  disabled,
  sendValidStatusWithValue,
}) => {
  const { onInput, onInvalid } = useCustomValidityMessage(patterns, setValid);
  const id = `${idPrefix}-${label.replace(' ', '-')}`;
  return (
    <div className={mod.vTextInput} data-disabled={disabled}>
      {icon && (
        <Icon
          name={typeof icon === 'string' ? icon : icon[0]}
          className={mod.vTextInput__icon}
        />
      )}
      <input
        className={`${mod.vTextIcon__input} ${
          highlightInvalidInput ? mod.vTextInput__inputHighlightInvalid : ''
        }`}
        ref={inputRef}
        type={type}
        placeholder={' '}
        pattern={patternToString(patterns)}
        minLength={minLength}
        required={required}
        autoComplete={Boolean(autoComplete).toString()}
        aria-label={ariaLabel || label}
        disabled={disabled}
        id={id}
        {...(onChange && {
          value,
          onChange: e =>
            onChange(
              sendValidStatusWithValue
                ? { value: e.target.value, valid: e.target.checkValidity() }
                : e.target.value,
            ),
        })}
        onInvalid={onInvalid}
        onInput={onInput}
        defaultValue={defaultValue}
      />
      <label htmlFor={id} className={mod.vTextInput__label}>
        {label}
      </label>
    </div>
  );
};

export { ValidatedTextInput };
