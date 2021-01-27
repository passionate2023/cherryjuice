import { useMemo, useState } from 'react';
export type CheckValidity = (currentValue: string) => boolean;
export type OnAcceptInput = (currentValue: string, valid: boolean) => void;
export type InlineInputProps = {
  checkValidity: CheckValidity;
  currentlyEnabledInput: string;
  setCurrentlyEnabledInput: (inputId: string) => void;
  enableInput: (inputId: string) => () => void;
  disableInput: (inputId: string, originalInputValue: string) => OnAcceptInput;
};

type InlineInputProviderProps = {
  inputValues?: string[];
  onApply: (inputId: string, newInputValue: string) => void;
  onDiscard: (inputId: string) => void;
};

export const useInlineInputProvider = ({
  inputValues = [],
  onApply,
  onDiscard,
}: InlineInputProviderProps) => {
  const [currentlyEnabledInput, setCurrentlyEnabledInput] = useState('');

  return useMemo(() => {
    const enableInput = inputId => () => setCurrentlyEnabledInput(inputId);
    const disableInput = (inputId: string, originalInputValue: string) => (
      value,
      valid,
    ) => {
      if (!valid) return;
      if (value) {
        if (value !== originalInputValue) onApply(inputId, value);
      } else {
        const newInput = !originalInputValue;
        if (newInput) onDiscard(inputId);
      }
      setCurrentlyEnabledInput('');
    };
    const folderNames = new Set(inputValues);
    const sectionElementProps: InlineInputProps = {
      checkValidity: value => !folderNames.has(value),
      currentlyEnabledInput,
      setCurrentlyEnabledInput,
      enableInput,
      disableInput,
    };
    return sectionElementProps;
  }, [inputValues, currentlyEnabledInput]);
};
