import * as React from 'react';
import { modNodeMeta } from '::sass-modules';
import { useDebouncedEventHandler } from '::hooks/react/debounced-event-handler';

type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
  testId?: string;
};

const ColorInput: React.FC<Props> = ({ disabled, onChange, value, testId }) => {
  const onChangeM = useDebouncedEventHandler(onChange, 200);

  return (
    <input
      disabled={disabled}
      type={'color'}
      onChange={onChangeM}
      value={value}
      className={`${modNodeMeta.nodeMeta__input__colorInput} ${
        disabled ? modNodeMeta.nodeMeta__inputDisabled : ''
      }`}
      data-testid={testId}
    />
  );
};

export { ColorInput };
