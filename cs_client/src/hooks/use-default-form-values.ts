import { useEffect } from 'react';

const useDefaultValues = inputs => {
  useEffect(() => {
    inputs[0].inputRef.current.value = 'ycnmhd';
    inputs[1].inputRef.current.value = 'Apassword0';
  }, []);
};

export { useDefaultValues };
