import * as React from 'react';
import { modTimeFilter } from '::sass-modules/';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::shared-components/icon/icon';
import { TimeFilter } from '::types/graphql/generated';
import { mapTimestampToDateString } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-time-stamp-to-date-string';
import { TimeFilterAC } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';

type Props = {
  customRange: TimeFilter;
  timeFilterAC: TimeFilterAC;
};

const CustomRange: React.FC<Props> = ({ customRange, timeFilterAC }) => {
  const customRangeString = `${mapTimestampToDateString(
    customRange.rangeStart,
  ).substring(2)} to ${mapTimestampToDateString(customRange.rangeEnd).substring(
    2,
  )}`;
  return (
    <>
      <span
        className={modTimeFilter.timeFilter__timestamp}
        onClick={timeFilterAC.showCustomRangePicker}
      >
        {customRangeString}
      </span>
      <ButtonCircle
        icon={<Icon name={Icons.material.clear} />}
        onClick={timeFilterAC.clearCustomTimeFilter}
      />
    </>
  );
};

export { CustomRange };
