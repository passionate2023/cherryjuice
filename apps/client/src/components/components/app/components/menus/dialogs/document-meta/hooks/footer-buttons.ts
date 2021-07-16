import { TDialogFooterButton } from '::shared-components/dialog/dialog-footer';
import { useMemo } from 'react';
import { ac } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';

export const useFooterButtons = ({ apply }): TDialogFooterButton[] => {
  return useMemo(
    () => [
      {
        label: 'dismiss',
        onClick: ac.dialogs.hideDocumentMetaDialog,
        disabled: false,
      },
      {
        label: 'apply',
        onClick: apply,
        disabled: false,
        testId: testIds.documentMeta__apply,
      },
    ],
    [apply],
  );
};
