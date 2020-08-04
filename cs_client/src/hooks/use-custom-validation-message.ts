import { useCallback } from 'react';
import { TPattern } from '::auth/helpers/form-validation';
const useCustomValidityMessage = (
  patterns: TPattern[],
  setValid?: (boolean) => void,
) => {
  const validatePattern = useCallback(
    e => {
      const value = e.target.value;
      let valid = true;
      for (const { pattern, description } of patterns) {
        if (value && !new RegExp(pattern).test(value)) {
          e.target?.setCustomValidity(description);
          valid = false;
          break;
        }
      }
      return valid;
    },
    [patterns],
  );
  const onInvalid = e => {
    const validity = e.target.validity;
    if (!validity.valid) {
      if (validity.patternMismatch && !validity.valueMissing) {
        validatePattern(e);
      }
    }
  };
  const onInput = e => {
    e.target.setCustomValidity('');
    if (setValid) setValid(e.target.validity.valid);
  };

  return { onInvalid, onInput };
};

export { useCustomValidityMessage };
