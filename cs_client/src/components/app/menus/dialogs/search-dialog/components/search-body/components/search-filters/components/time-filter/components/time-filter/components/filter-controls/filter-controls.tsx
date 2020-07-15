import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modTimeFilter } from '::sass-modules/';
import { CustomRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/filter-controls/components/custom-range';
import { SelectRange } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/filter-controls/components/select-range';
import { TimeFilter, TimeRange } from '::types/graphql/generated';
import { TimeFilterAC } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';
import { useSpring, animated } from 'react-spring';
import { configs } from '::shared-components/transitions/transitions';

type Props = {
  timeFilter: TimeFilter;
  enableFilters: boolean;
  timeFilterAC: TimeFilterAC;
};

const FilterControls: React.FC<Props> = ({
  timeFilter,
  enableFilters,
  timeFilterAC,
}) => {
  const enableCustomFilter =
    (timeFilter.rangeName as TimeRange) === TimeRange.CustomRange &&
    Boolean(timeFilter?.rangeStart);

  const props = useSpring({
    to: {
      opacity: enableFilters ? 1 : 0,
      transform: enableFilters ? 'translateX(0px)' : 'translateX(-50px)',
    },
    config: configs.c2,
  });
  return (
    <animated.div
      className={joinClassNames([modTimeFilter.timeFilter__filterContainer])}
      style={props}
    >
      {enableCustomFilter ? (
        <CustomRange timeFilterAC={timeFilterAC} customRange={timeFilter} />
      ) : (
        <SelectRange
          timeFilterAC={timeFilterAC}
          timeFilter={timeFilter}
        />
      )}
    </animated.div>
  );
};

export { FilterControls };
