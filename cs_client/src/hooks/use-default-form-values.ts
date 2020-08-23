import { useEffect } from 'react';
import { ValidatedTextInputProps } from '::root/components/shared-components/form/validated-text-input';

const useDefaultValues = (inputs: ValidatedTextInputProps[]): void => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (inputs.length > 2
        ? ['yacine', 'mhd', 'ycnmhd', 'myacine70@gmail.com', 'Apassword0']
        : ['ycnmhd', 'Apassword0']
      ).forEach((prop, i) => {
        // @ts-ignore
        inputs[i].inputRef.current.value = prop;
      });
    }
  }, []);
};

export { useDefaultValues };
