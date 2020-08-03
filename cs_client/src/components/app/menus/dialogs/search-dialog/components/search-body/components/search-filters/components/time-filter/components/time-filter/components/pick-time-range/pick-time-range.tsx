import * as React from 'react';
import { useState } from 'react';
import { BaseModal } from '::shared-components/modal/base-modal';
import {
  TimeInput,
  TimeInputProps,
} from '::app/menus/dialogs/search-dialog/components/search-body/components/search-filters/components/time-filter/components/time-filter/components/pick-time-range/components/time-input';
import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { appModule, modPickTimeRange } from '::sass-modules';
import { TimeFilter, TimeRange } from '::types/graphql/generated';
import { createPortal } from 'react-dom';

type Props = {
  onSubmit: (timeFilter: TimeFilter) => void;
  onClose: () => void;
  initialRange?: TimeFilter;
  show: boolean;
  title: string;
};
const dateInputToTimestamp = (e): number => new Date(e.target.value).getTime();
const PickTimeRange: React.FC<Props> = ({
  onSubmit,
  onClose,
  initialRange,
  show,
  title,
}) => {
  const [rangeStart, setRangeStart] = useState<number>(initialRange.rangeStart);
  const [rangeEnd, setRangeEnd] = useState<number>(initialRange.rangeEnd);
  const timeInputs: TimeInputProps[] = [
    {
      label: 'from',
      onChange: e => setRangeStart(dateInputToTimestamp(e)),
      defaultValue: rangeStart,
      maxValue: rangeEnd,
    },
    {
      label: 'to',
      onChange: e => setRangeEnd(dateInputToTimestamp(e)),
      defaultValue: rangeEnd,
      minValue: rangeStart,
    },
  ];
  const buttons: TDialogFooterButton[] = [
    { label: 'dismiss', onClick: onClose },
    {
      label: 'select',
      onClick: () => {
        let tempRangeEnd = rangeEnd;
        if (rangeStart) {
          if (!rangeEnd) {
            const now = new Date().getTime();
            if (rangeStart > now) tempRangeEnd = rangeStart + 1;
            else tempRangeEnd = now;
          }
          onSubmit({
            rangeStart,
            rangeEnd: tempRangeEnd,
            rangeName: TimeRange.CustomRange,
          });
        }
        onClose();
      },
    },
  ];
  return createPortal(
    <BaseModal onClose={onClose} show={show} buttons={buttons} title={title}>
      <div className={modPickTimeRange.pickTimeRange}>
        <div className={modPickTimeRange.pickTimeRange__form}>
          {timeInputs.map(props => (
            <TimeInput key={props.label} {...props} />
          ))}
        </div>
      </div>
    </BaseModal>,
    document.querySelector('.' + appModule.app),
  );
};

export { PickTimeRange };
