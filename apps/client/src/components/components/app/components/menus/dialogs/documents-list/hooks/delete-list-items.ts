import { DialogHeaderButton } from '::root/components/shared-components/dialog/dialog-header';
import { Icons } from '@cherryjuice/icons';
import { testIds } from '@cherryjuice/test-ids';
import { MuteCallback } from '::root/components/shared-components/dialog/dialog-list/dialog-list-item';

type DeleteListItemsProps = {
  deletionMode: boolean;
  hidden: boolean;
  enableDeletionMode: MuteCallback;
  disableDeletionMode: MuteCallback;
  performDeletion: MuteCallback;
  selectAll: MuteCallback;
  numberOfSelectedElements: number;
};

const useDeleteListItems = ({
  deletionMode,
  hidden,
  enableDeletionMode,
  disableDeletionMode,
  selectAll,
  performDeletion,
  numberOfSelectedElements,
}: DeleteListItemsProps): DialogHeaderButton[] => {
  return hidden
    ? []
    : [
        {
          hidden: deletionMode,
          onClick: enableDeletionMode,
          icon: Icons.material['delete-sweep'],
          testId: testIds.dialogs__selectDocument__header__buttons__deleteSweep,
        },
        {
          hidden: !deletionMode,
          onClick: disableDeletionMode,
          icon: Icons.material.cancel,
        },
        {
          hidden: !deletionMode,
          onClick: selectAll,
          icon: Icons.material['select-all'],
          testId: testIds.dialogs__selectDocument__header__buttons__deleteAll,
        },
        {
          hidden: !deletionMode,
          onClick: performDeletion,
          icon: Icons.material['delete'],
          testId: testIds.dialogs__selectDocument__header__buttons__delete,
          disabled: numberOfSelectedElements === 0,
        },
      ];
};

export { useDeleteListItems };
