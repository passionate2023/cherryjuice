import { useLayoutEffect, useState } from 'react';

export type OnToggleInput = (id: string) => void;
type Props = {
  existingValue: string;
  onApply: (newValue: string) => void;
  onDiscard: () => void;
  onToggle: OnToggleInput;
  inputId: string;
};

export const useInlineInput = ({
  existingValue: text,
  onApply,
  onDiscard,
  onToggle,
  inputId,
}: Props) => {
  const [inputMode, setInputMode] = useState(!text);

  const enableInput = () => {
    setInputMode(true);
  };
  const disableInput = (value, valid) => {
    if (!valid) return;
    if (value) {
      if (value !== text) onApply(value);
    } else {
      const newInput = !text;
      if (newInput) onDiscard();
    }
    setInputMode(false);
  };
  useLayoutEffect(() => {
    onToggle(inputMode ? inputId : '');
  }, [inputMode]);

  return { inputMode, enableInput, disableInput };
};
