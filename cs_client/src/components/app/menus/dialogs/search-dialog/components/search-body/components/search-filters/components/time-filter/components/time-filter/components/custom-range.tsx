import * as React from 'react';
import { modTimeFilter } from '::sass-modules/';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::shared-components/icon/icon';
import { TimeFilter } from '::types/graphql/generated';
import { EventHandler } from 'react';
import { mapTimestampToDateString } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/helpers/map-time-stamp-to-date-string';

type Props = {
  setShowCustomRangePicker: Function;
  customRange: TimeFilter;
  resetCustomRange: EventHandler<any>;
};

const CustomRange: React.FC<Props> = ({
  setShowCustomRangePicker,
  customRange,
  resetCustomRange,
}) => {
  const customRangeString = `${mapTimestampToDateString(
    customRange.rangeStart,
  ).substring(2)} to ${mapTimestampToDateString(customRange.rangeEnd).substring(
    2,
  )}`;
  return (
    <>
      <span
        className={modTimeFilter.timeFilter__timestamp}
        onClick={() => {
          setShowCustomRangePicker(true);
        }}
      >
        {customRangeString}
      </span>
      <ButtonCircle
        icon={<Icon name={Icons.material.clear} />}
        onClick={resetCustomRange}
      />
    </>
  );
};

export { CustomRange };
