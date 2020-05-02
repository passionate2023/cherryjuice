import { TPattern } from '::app/auth/helpers/form-validation';
import { useEffect } from 'react';

const useCustomValidityMessage = ({
  inputRef,
  patterns,
}: {
  inputRef;
  patterns: TPattern[];
}) => {
  useEffect(() => {
    const validatePattern = value => {
      let valid = true;
      for (const { pattern, description } of patterns) {
        if (!new RegExp(pattern).test(value)) {
          inputRef.current.setCustomValidity(description);
          valid = false;
          break;
        }
      }
      return valid;
    };
    inputRef.current.oninvalid = ({ target }: { target: HTMLInputElement }) => {
      const validity = target.validity;
      if (!validity.valid) {
        if (validity.patternMismatch && !validity.valueMissing) {
          validatePattern(target.value);
        }
      }
    };
    inputRef.current.oninput = e => {
      e.target.setCustomValidity('');
    };
  }, []);
};

export { useCustomValidityMessage };
