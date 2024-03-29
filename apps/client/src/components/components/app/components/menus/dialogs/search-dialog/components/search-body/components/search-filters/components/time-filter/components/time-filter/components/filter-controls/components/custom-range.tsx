import * as React from 'react';
import { modTimeFilter } from '::sass-modules';
import { ButtonCircle } from '@cherryjuice/components';
import { Icon, Icons } from '@cherryjuice/icons';
import { TimeFilter } from '@cherryjuice/graphql-types';
import { mapTimestampToDateString } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-time-stamp-to-date-string';
import { TimeFilterAC } from '::root/components/app/components/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/reducer';

type Props = {
  customRange: TimeFilter;
  timeFilterAC: TimeFilterAC;
};

const CustomRange: React.FC<Props> = ({ customRange, timeFilterAC }) => {
  const customRangeString = [
    `${mapTimestampToDateString(customRange.rangeStart).substring(2)}`,
    `${mapTimestampToDateString(customRange.rangeEnd).substring(2)}`,
  ];
  return (
    <>
      <span
        className={modTimeFilter.timeFilter__timestamp}
        onClick={timeFilterAC.showCustomRangePicker}
      >
        {customRangeString.map(string => (
          <span
            key={string}
            className={modTimeFilter.timeFilter__timestamp__item}
          >
            {string}
          </span>
        ))}
      </span>
      <ButtonCircle
        icon={<Icon name={Icons.material.clear} />}
        onClick={timeFilterAC.clearCustomTimeFilter}
      />
    </>
  );
};

export { CustomRange };
