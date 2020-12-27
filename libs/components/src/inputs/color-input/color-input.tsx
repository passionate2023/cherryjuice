import * as React from 'react';
import mod from './color-input.scss';
import {
  joinClassNames,
  useDebouncedEventHandler,
} from '@cherryjuice/shared-helpers';

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
      className={joinClassNames([
        mod.colorInput,
        [mod.colorInputDisabled, disabled],
      ])}
      data-testid={testId}
    />
  );
};

export { ColorInput };
