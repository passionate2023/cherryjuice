import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { useEffect, useRef } from 'react';
import mod from './select.scss';

type Option = { label: string; value: string };
type Props = {
  disabled?: boolean;
  onChange: (value: string) => void;
  value?: string;
  testId?: string;
  options: (string | Option)[];
  isOptionDisabled?: (value: string) => boolean;
  valueToLabel?: (string) => string;
};
export const Select: React.FC<Props> = ({
  value,
  onChange,
  disabled,
  testId,
  isOptionDisabled,
  options,
  valueToLabel,
}) => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.value = value;
  }, [value]);
  const mappedOptions = (typeof options[0] === 'string'
    ? options.map(value => ({
        value,
        label: valueToLabel ? valueToLabel(value) : value,
      }))
    : options) as Option[];
  return (
    <select
      ref={ref}
      className={joinClassNames([mod.select, disabled && mod.selectDisabled])}
      onChange={e => onChange(e.target.value)}
      defaultValue={value}
      disabled={disabled}
      data-testid={testId}
    >
      {mappedOptions.map(({ value, label }) => (
        <option
          value={value}
          key={value}
          disabled={isOptionDisabled && isOptionDisabled(value)}
        >
          {label}
        </option>
      ))}
    </select>
  );
};
