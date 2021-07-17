import * as React from 'react';
import { modChips } from '::sass-modules';
import { testIds } from '@cherryjuice/test-ids';
import {
  Chip,
  ChipProps,
  RemoveChipCallback,
} from '::root/components/app/components/menus/dialogs/document-meta/components/chips/components/chip';

export type ChipsListProps = {
  chips: ChipProps[];
  onRemove: RemoveChipCallback;
};

const ChipsList: React.FC<ChipsListProps> = ({ chips, onRemove }) => {
  return (
    <div
      className={modChips.chips__list}
      data-testid={testIds.form__chips__chipsList}
    >
      {chips.map((chip, i) =>
        chip.text ? (
          <Chip {...chip} key={chip.text + i} onRemove={onRemove} />
        ) : (
          <React.Fragment key={chip.text + i} />
        ),
      )}
    </div>
  );
};

export { ChipsList };
