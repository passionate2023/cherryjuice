import * as React from 'react';
import { ToolbarButton } from '::root/buttons';
import { useDebouncedEventHandler } from '@cherryjuice/shared-helpers';
import { Icon } from '@cherryjuice/icons';

type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  id: string;
  icon?: string;
  testId?: string;
};

const ToolbarColorInput: React.FC<Props> = ({
  icon,
  disabled,
  onChange,
  id,
}) => {
  const onChangeM = useDebouncedEventHandler(onChange, 200);
  return (
    <ToolbarButton disabled={disabled}>
      <label htmlFor={id} style={!disabled ? { cursor: 'pointer' } : {}}>
        <Icon name={icon} />
        <input
          id={id}
          type="color"
          style={{ display: 'none' }}
          onChange={onChangeM}
        />
      </label>
    </ToolbarButton>
  );
};

export { ToolbarColorInput };
