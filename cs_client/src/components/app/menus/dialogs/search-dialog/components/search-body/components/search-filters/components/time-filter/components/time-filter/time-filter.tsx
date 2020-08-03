import * as React from 'react';
import { useEffect, useReducer, useRef } from 'react';
import { modTimeFilter } from '::sass-modules';
import { PickTimeRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/pick-time-range/pick-time-range';
import { TimeFilter, TimeRange } from '::types/graphql/generated';
import {
  createTimeFilterAC,
  TimeFilterAC,
  timeFilterInitialState,
  timeFilterReducer,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { FilterControls } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/filter-controls/filter-controls';

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
  const [state, dispatch] = useReducer(timeFilterReducer, {}, () => ({
    ...timeFilterInitialState,
    timeFilter,
  }));

  const timeFilterAC = useRef<TimeFilterAC>();
  if (!timeFilterAC.current) {
    timeFilterAC.current = createTimeFilterAC();
    timeFilterAC.current.setDispatch(dispatch);
  }
  useEffect(() => {
    onChange(state.timeFilter);
  }, [state.timeFilter]);
  const enableFilters = state.timeFilter.rangeName !== TimeRange.AnyTime;

  return (
    <div className={modTimeFilter.timeFilter}>
      <div className={modTimeFilter.timeFilter__selectContainer}>
        <ButtonSquare
          text={filterName}
          active={enableFilters}
          onClick={timeFilterAC.current.toggleTimeFilter}
          className={modTimeFilter.timeFilter__filterToggle}
        />
        <FilterControls
          enableFilters={enableFilters}
          timeFilter={state.timeFilter}
          timeFilterAC={timeFilterAC.current}
        />
      </div>
      <PickTimeRange
        onSubmit={timeFilterAC.current.setCustomTimeFilter}
        onClose={timeFilterAC.current.hideCustomRangePicker}
        initialRange={state.timeFilter}
        show={state.showCustomRangePicker}
        title={filterName + ' - custom range'}
      />
    </div>
  );
};

export { Filter };
export { TimeFilterProps };
