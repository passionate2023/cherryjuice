import * as React from 'react';
import { TimeFilter, TimeRange } from '@cherryjuice/graphql-types';
import { mapScopeToLabel } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/search-target/components/target';
import { TimeFilterAC } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';
import { Select } from '::root/components/shared-components/inputs/select';

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
  return (
    <Select
      onChange={timeFilterAC.setPredefinedTimeFilter}
      value={timeFilter.rangeName}
      options={ranges}
      valueToString={mapScopeToLabel}
    />
  );
};

export { SelectRange };
