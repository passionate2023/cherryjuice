import * as React from 'react';
import { useCallback, useState } from 'react';
import { modTimeFilter } from '::sass-modules/';
import { PickTimeRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/pick-time-range/pick-time-range';
import { mapRangeNameToTimeFilter } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-range-name-to-time-filter';
import { TimeFilter, TimeRange } from '::types/graphql/generated';
import { CustomRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/custom-range';
import { SelectRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/select-range';

type TimeFilterProps = {
  filterName: string;
  onChange: (timeFilter: TimeFilter) => void;
  timeFilter: TimeFilter;
};

const Filter: React.FC<TimeFilterProps> = ({
  filterName,
  onChange,
  timeFilter,
}) => {
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customRange, setCustomRange] = useState<TimeFilter>(timeFilter);
  const [rangeName, setRangeName] = useState<TimeRange>(timeFilter.rangeName);
  const setRangeNameM = useCallback(e => {
    if ((e.target.value as TimeRange) === TimeRange.CustomRange)
      setShowCustomRangePicker(true);
    else {
      const filter = mapRangeNameToTimeFilter(e.target.value as TimeRange);
      onChange(filter);
    }
    setRangeName(e.target.value);
  }, []);
  const setCustomRangeM = (filter: TimeFilter) => {
    onChange(filter);
    setCustomRange(filter);
  };
  const resetCustomRange = () => {
    setRangeNameM({
      target: { value: TimeRange.AnyTime },
    });
  };

  const aCustomRangeIsSelected =
    (rangeName as TimeRange) === TimeRange.CustomRange &&
    Boolean(customRange?.rangeStart);
  return (
    <div className={modTimeFilter.timeFilter}>
      <div className={modTimeFilter.timeFilter__selectContainer}>
        <span className={modTimeFilter.timeFilter__filterName}>
          {filterName}
        </span>
        {aCustomRangeIsSelected ? (
          <CustomRange
            customRange={customRange}
            resetCustomRange={resetCustomRange}
            setShowCustomRangePicker={setShowCustomRangePicker}
          />
        ) : (
          <SelectRange
            defaultRangeName={rangeName}
            setRangeName={setRangeNameM}
          />
        )}
      </div>
      <PickTimeRange
        onSubmit={setCustomRangeM}
        onClose={() => setShowCustomRangePicker(false)}
        initialRange={customRange}
        show={showCustomRangePicker}
        title={filterName + ' - custom range'}
      />
    </div>
  );
};

export { Filter };
export { TimeFilterProps };
