import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modChips } from '::sass-modules';
import {
  AddChip,
  AddChipProps,
} from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/add-chip';
import {
  ChipsList,
  ChipsListProps,
} from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/chips-list';

type Props = AddChipProps & ChipsListProps;

const Chips: React.FC<Props> = ({
  onRemove,
  addChip,
  placeholder,
  chips,
  pattern,
  label,
}) => {
  return (
    <div className={joinClassNames([modChips.guests])}>
      <AddChip
        addChip={addChip}
        placeholder={placeholder}
        pattern={pattern}
        chips={chips}
        label={label}
      />
      <ChipsList chips={chips} onRemove={onRemove} />
    </div>
  );
};

export { Chips };
