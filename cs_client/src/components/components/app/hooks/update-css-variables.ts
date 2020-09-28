import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';
import { filter, take, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { modDialog } from '::sass-modules';
import { ac, Store } from '::store/store';
import { useSelector } from 'react-redux';
import { CssVariables } from '::store/ducks/css-variables';

export const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  showRecentNodes: boolean,
  treeWidth: number,
  previousTreeWidth: number,
) => {
  const dockedDialog = useSelector((state: Store) => state.root.dockedDialog);
  const showSearchDialog = useSelector(
    (state: Store) => state.search.searchState !== 'idle',
  );
  const showSettingsDialog = useSelector(
    (state: Store) => state.dialogs.showSettingsDialog,
  );
  const showDocumentList = useSelector(
    (state: Store) => state.dialogs.showDocumentList,
  );

  useEffect(() => {
    ac.cssVariables.set(
      CssVariables.treeWidth,
      showTree ? previousTreeWidth : 0,
    );
  }, [showTree, previousTreeWidth]);

  useEffect(() => {
    if (isDocumentOwner && showFormattingButtons) {
      cssVariables.setFormattingBar(40);
    } else {
      (async () => {
        await formattingBarUnmountAnimationDelay();
        cssVariables.setFormattingBar(0);
      })();
    }
  }, [showFormattingButtons, isDocumentOwner]);

  useEffect(() => {
    if (showRecentNodes) {
      cssVariables.setRecentNodes(40);
    } else {
      cssVariables.setRecentNodes(0);
    }
  }, [showRecentNodes]);

  const dialogIsShown =
    showSearchDialog || showSettingsDialog || showDocumentList;
  useEffect(() => {
    if (dockedDialog && dialogIsShown) {
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
  }, [dockedDialog, dialogIsShown]);
};
