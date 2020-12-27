import { ValidatedTextInputProps } from '@cherryjuice/components';
import { useState } from 'react';

export const useStatefulValidatedInput = (input: ValidatedTextInputProps) => {
  const [valid, setValid] = useState(false);
  const [value, setValue] = useState('');
  input.setValid = setValid;
  input.onChange = setValue;
  input.value = value;
  return { value, valid, setValue };
};
