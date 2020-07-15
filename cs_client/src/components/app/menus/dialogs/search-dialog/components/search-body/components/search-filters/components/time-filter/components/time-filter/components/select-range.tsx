import * as React from 'react';
import { TimeRange } from '::types/graphql/generated';
import { modTimeFilter } from '::sass-modules/';
import { mapScopeToLabel } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { EventHandler } from 'react';

const ranges: TimeRange[] = [
  TimeRange.AnyTime,
  TimeRange.PastHour,
  TimeRange.PastDay,
  TimeRange.PastWeek,
  TimeRange.PastMonth,
  TimeRange.PastYear,
  TimeRange.CustomRange,
];

type Props = {
  setRangeName: EventHandler<undefined>;
  defaultRangeName: TimeRange;
};

const SelectRange: React.FC<Props> = ({ setRangeName, defaultRangeName }) => {
  return (
    <select
      id=""
      className={modTimeFilter.timeFilter__select}
      onChange={setRangeName}
      defaultValue={defaultRangeName}
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
