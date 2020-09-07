import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';
import { filter, take, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { modDialog } from '::sass-modules';
import { ac } from '::store/store';

export const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  treeWidth: number,
  searchDialogIsShown: boolean,
  showRecentNodes: boolean,
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
    if (showRecentNodes) {
      cssVariables.setRecentNodes(40);
    } else {
      cssVariables.setRecentNodes(0);
    }
  }, [showRecentNodes]);

  useEffect(() => {
    if (searchDialogIsShown) {
      cssVariables.setDockedDialogHeight(50);
      ac.root.setDocking(false);
    } else {
      ac.root.setDocking(true);
      cssVariables.setDockedDialogHeight(0);
      interval(50)
        .pipe(
          filter(() => !document.querySelector('.' + modDialog.dialogDocked)),
          tap(() => {
            ac.root.setDocking(false);
          }),
          take(1),
        )
        .subscribe();
    }
  }, [searchDialogIsShown]);
};
