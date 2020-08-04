import * as React from 'react';
import { modLogin } from '::sass-modules/index';
import { Icon } from '::shared-components/icon/icon';
import { Ref } from 'react';
import { patternToString, TPattern } from '::auth/helpers/form-validation';
import { useCustomValidityMessage } from '::hooks/use-custom-validation-message';

export type ValidatedTextInputProps = {
  label: string;
  inputRef: Ref<HTMLInputElement>;
  variableName: string;
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
};

const ValidatedTextInput: React.FC<ValidatedTextInputProps & {
  highlightInvalidInput?: boolean;
}> = ({
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
}) => {
  const { onInput, onInvalid } = useCustomValidityMessage(patterns, setValid);
  const id = `${idPrefix}-${label.replace(' ', '-')}`;
  return (
    <div className={modLogin.login__form__input}>
      {icon && (
        <Icon
          loadAsInlineSVG={'force'}
          name={typeof icon === 'string' ? icon : icon[0]}
          className={modLogin.login__form__input__icon}
        />
      )}
      <input
        className={`${modLogin.login__form__input__input} ${
          highlightInvalidInput
            ? modLogin.login__form__input__inputHighlightInvalid
            : ''
        }`}
        ref={inputRef}
        type={type}
        placeholder={' '}
        pattern={patternToString(patterns)}
        minLength={minLength}
        required={required}
        autoComplete={Boolean(autoComplete).toString()}
        aria-label={ariaLabel || label}
        id={id}
        {...(onChange && { value, onChange: e => onChange(e.target.value) })}
        onInvalid={onInvalid}
        onInput={onInput}
      />
      <label htmlFor={id} className={modLogin.login__form__input__label}>
        {label}
      </label>
    </div>
  );
};

export { ValidatedTextInput };
