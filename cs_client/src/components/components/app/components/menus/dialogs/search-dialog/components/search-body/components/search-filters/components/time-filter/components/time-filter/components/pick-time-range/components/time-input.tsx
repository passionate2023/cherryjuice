import * as React from 'react';
import { modPickTimeRange } from '::sass-modules';
import { EventHandler, useEffect, useRef } from 'react';
import { mapTimestampToDateString } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-time-stamp-to-date-string';

type TimeInputProps = {
  label: string;
  onChange: EventHandler<undefined>;
  defaultValue?: number;
  maxValue?: number;
  minValue?: number;
};
const TimeInput: React.FC<TimeInputProps> = ({
  label,
  onChange,
  defaultValue,
  maxValue,
  minValue,
}) => {
  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    if (defaultValue) {
      ref.current.value = mapTimestampToDateString(defaultValue);
    }
    if (maxValue) {
      ref.current.max = mapTimestampToDateString(maxValue);
    }
    if (minValue) {
      ref.current.min = mapTimestampToDateString(minValue);
    }
  }, [defaultValue, minValue, maxValue]);

  return (
    <div className={modPickTimeRange.pickTimeRange__form__field}>
      <label
        className={modPickTimeRange.pickTimeRange__form__field__inputLabel}
        htmlFor={label}
      >
        {label}
      </label>
      <input
        ref={ref}
        type="date"
        className={modPickTimeRange.pickTimeRange__form__field__input}
        name={label}
        onChange={onChange}
      />
    </div>
  );
};

export { TimeInput };
export { TimeInputProps };
