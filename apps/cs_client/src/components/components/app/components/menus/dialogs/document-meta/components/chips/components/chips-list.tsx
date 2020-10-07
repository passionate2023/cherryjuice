import * as React from 'react';
import { modChips } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
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
      {chips.map(chip =>
        chip.text ? (
          <Chip {...chip} key={chip.text} onRemove={onRemove} />
        ) : (
          <></>
        ),
      )}
    </div>
  );
};

export { ChipsList };
