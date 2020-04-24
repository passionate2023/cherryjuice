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
    const validate = value => {
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
    inputRef.current.oninvalid = e => {
      e.target.setCustomValidity('');
      if (!e.target.validity.valid) validate(e.target.value);
    };
    inputRef.current.oninput = e => {
      e.target.setCustomValidity('');
    };
  }, []);
};

export { useCustomValidityMessage };
