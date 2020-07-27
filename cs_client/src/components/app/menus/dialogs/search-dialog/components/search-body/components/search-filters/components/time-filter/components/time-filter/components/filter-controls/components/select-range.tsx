import * as React from 'react';
import { TimeFilter, TimeRange } from '::types/graphql/generated';
import { modTimeFilter } from '::sass-modules/';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { TimeFilterAC } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';
import { useEffect, useRef } from 'react';

const ranges: TimeRange[] = [
  TimeRange.PastHour,
  TimeRange.PastDay,
  TimeRange.PastWeek,
  TimeRange.PastMonth,
  TimeRange.PastYear,
  TimeRange.CustomRange,
];

type Props = {
  timeFilterAC: TimeFilterAC;
  timeFilter: TimeFilter;
};
const SelectRange: React.FC<Props> = ({ timeFilterAC, timeFilter }) => {
  const ref = useRef<HTMLSelectElement>();
  useEffect(() => {
    ref.current.selectedIndex = ranges.indexOf(timeFilter.rangeName);
  }, [timeFilter.rangeName]);
  return (
    <select
      ref={ref}
      id=""
      className={modTimeFilter.timeFilter__select}
      onChange={e =>
        timeFilterAC.setPredefinedTimeFilter(e.target.value as TimeRange)
      }
      defaultValue={timeFilter.rangeName}
    >
      {ranges.map(range => (
        <option value={range} key={range}>
          {mapScopeToLabel(range)}
        </option>
      ))}
    </select>
  );
};

export { SelectRange };
