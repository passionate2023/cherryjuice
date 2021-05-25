import { createContext, useMemo, useState } from 'react';
export type CheckValidity = (currentValue: string) => boolean;
export type OnAcceptInput = (currentValue: string, valid: boolean) => void;
export type EnableInput = (inputId: string) => () => void;
export type InlineInputProps = {
  checkValidity: CheckValidity;
  currentlyEnabledInput: string;
  enableInput: EnableInput;
  disableInput: (inputId: string, originalInputValue: string) => OnAcceptInput;
};

type InputAction = (
  inputId: string,
  newInputValue: string,
  originalInputValue: string,
) => void;
type InlineInputProviderProps = {
  inputValues?: string[];
  onApply: InputAction;
  onDiscard?: InputAction;
  disable?: boolean;
};

const noop = () => undefined;
export const useInlineInputProvider = ({
  inputValues = [],
  onApply,
  onDiscard = noop,
  disable,
}: InlineInputProviderProps) => {
  const [currentlyEnabledInput, setCurrentlyEnabledInput] = useState('');
  return useMemo(() => {
    const enableInput = inputId => () =>
      setCurrentlyEnabledInput(!disable && inputId);
    const disableInput = (inputId: string, originalInputValue: string) => (
      value,
      valid,
    ) => {
      value = value.trim();
      originalInputValue = originalInputValue.trim();
      if (!valid) return;
      if (value) {
        if (value !== originalInputValue)
          onApply(inputId, value, originalInputValue);
      } else {
        const newInput = !originalInputValue;
        if (newInput) onDiscard(inputId, value, originalInputValue);
      }
      setCurrentlyEnabledInput('');
    };
    const folderNames = new Set(inputValues);
    const sectionElementProps: InlineInputProps = {
      checkValidity: value => !folderNames.has(value),
      currentlyEnabledInput,
      enableInput,
      disableInput,
    };
    return sectionElementProps;
  }, [disable, inputValues, currentlyEnabledInput]);
};

export const createInlineInputProviderContext = () =>
  createContext<InlineInputProps>({
    checkValidity: undefined,
    currentlyEnabledInput: undefined,
    disableInput: undefined,
    enableInput: undefined,
  });
