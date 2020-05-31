import * as React from 'react';
import { modLogin } from '::sass-modules/index';
import { Icon, ICON_COLOR } from '::shared-components/icon';
import { Ref } from 'react';
import { patternToString, TPattern } from '::auth/helpers/form-validation';
import { useCustomValidityMessage } from '::hooks/use-custom-validation-message';

export type TextInputProps = {
  label: string;
  inputRef: Ref<HTMLInputElement>;
  variableName: string;
  type?: string;
  icon?: string | [string, ICON_COLOR];
  ariaLabel?: string;
  minLength?: number;
  patterns?: TPattern[];
  required?: boolean;
  autoComplete?: boolean;
  idPrefix: string;
};

const TextInput: React.FC<TextInputProps & {
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
}) => {
  useCustomValidityMessage({ inputRef, patterns });
  const id = `${idPrefix}-${label.replace(' ', '-')}`;
  return (
    <div className={modLogin.login__form__input}>
      {icon && (
        <Icon
          name={typeof icon === 'string' ? icon : icon[0]}
          color={typeof icon === 'string' ? undefined : icon[1]}
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
      />
      <label htmlFor={id} className={modLogin.login__form__input__label}>
        {label}
      </label>
    </div>
  );
};

export { TextInput };
