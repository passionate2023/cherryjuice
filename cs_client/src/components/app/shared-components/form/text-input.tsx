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
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  ariaLabel,
  patterns = [],
  type = 'text',
  minLength = 0,
  required,
  inputRef,
}) => {
  useCustomValidityMessage({ inputRef, patterns });
  return (
    <span className={modLogin.login__form__input}>
      {icon && (
        <Icon
          name={typeof icon === 'string' ? icon : icon[0]}
          color={typeof icon === 'string' ? undefined : icon[1]}
          className={modLogin.login__form__input__icon}
        />
      )}
      <input
        className={modLogin.login__form__input__input}
        ref={inputRef}
        type={type}
        placeholder={label}
        aria-label={ariaLabel}
        pattern={patternToString(patterns)}
        minLength={minLength}
        required={required}
      />
    </span>
  );
};

export { TextInput };
