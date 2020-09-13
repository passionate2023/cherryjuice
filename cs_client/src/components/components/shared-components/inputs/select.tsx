import * as React from 'react';
import { modTimeFilter } from '::sass-modules';
import {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
} from 'react';

type Props<T = string> = {
  onChange: (value: T) => void;
  options: T[];
  value: T;
  valueToString?: (value: T) => string;
};
const Select = ({
  value,
  options,
  onChange,
  valueToString = x => x,
}: PropsWithChildren<Props>): ReactElement | null => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.selectedIndex = options.indexOf(value);
  }, [value]);
  const onChangeM = useCallback(e => onChange(e.target.value), []);
  return (
    <select
      ref={ref}
      className={modTimeFilter.timeFilter__select}
      onChange={onChangeM}
      defaultValue={value}
    >
      {options.map(range => (
        <option value={range} key={range}>
          {valueToString(range)}
        </option>
      ))}
    </select>
  );
};

export { Select };
