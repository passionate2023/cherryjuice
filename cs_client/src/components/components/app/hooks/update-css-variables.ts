import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';
import { filter, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { modDialog } from '::sass-modules';

export const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  treeWidth: number,
  searchDialogIsShown: boolean,
) => {
  useEffect(() => {
    cssVariables.setTreeWidth(showTree ? treeWidth : 0);
    if (isDocumentOwner && showFormattingButtons) {
      cssVariables.setFormattingBar(40);
    } else {
      (async () => {
        await formattingBarUnmountAnimationDelay();
        cssVariables.setFormattingBar(0);
      })();
    }
  }, [showFormattingButtons, showTree]);

  useEffect(() => {
    if (searchDialogIsShown) {
      cssVariables.setInfoBar(18);
      cssVariables.setDockedDialogHeight(50);
    } else {
      cssVariables.setInfoBar(0);
      cssVariables.setDockedDialogHeight(0);
      interval(50)
        .pipe(
          filter(() => !document.querySelector('.' + modDialog.dialogDocked)),
          tap(() => {
            cssVariables.setInfoBar(18);
          }),
        )
        .subscribe();
    }
  }, [searchDialogIsShown]);
};
