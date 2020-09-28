import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modTimeFilter } from '::sass-modules';
import { CustomRange } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/filter-controls/components/custom-range';
import { SelectRange } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/filter-controls/components/select-range';
import { TimeFilter, TimeRange } from '::types/graphql';
import { TimeFilterAC } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';
import { animated, useSpring } from 'react-spring';
import { configs } from '::root/components/shared-components/transitions/transitions';

export const useSlideSpring = (on: boolean) => {
  return useSpring({
    to: {
      opacity: on ? 1 : 0,
      transform: on ? 'translateX(0px)' : 'translateX(-50px)',
    },
    config: configs.c2,
  });
};

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

  const props = useSlideSpring(enableFilters);
  return (
    <animated.div
      className={joinClassNames([modTimeFilter.timeFilter__filterContainer])}
      style={props}
    >
      {enableCustomFilter ? (
        <CustomRange timeFilterAC={timeFilterAC} customRange={timeFilter} />
      ) : (
        <SelectRange timeFilterAC={timeFilterAC} timeFilter={timeFilter} />
      )}
    </animated.div>
  );
};

export { FilterControls };
