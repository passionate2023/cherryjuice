import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::app/components/editor/editor-toolbar/components/animated-editor-toolbar/animated-editor-toolbar';
import { filter, take, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { modDialog } from '::shared-components/dialog/dialog';
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
  const isOnMd = useSelector((state: Store) => state.root.isOnTb);

  const showNodePath = useSelector((state: Store) => state.editor.showNodePath);
  const barHeight = isOnMd ? 40 : 34;
  useEffect(() => {
    ac.cssVariables.set(CssVariables.nodePath, showNodePath ? barHeight : 0);
  }, [showNodePath, isOnMd]);

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
  const showBookmarks = useSelector(
    (state: Store) => state.dialogs.showBookmarks,
  );
  useEffect(() => {
    ac.cssVariables.set(
      CssVariables.treeWidth,
      showTree ? previousTreeWidth : 0,
    );
  }, [showTree, previousTreeWidth]);

  const showToolbar = isDocumentOwner && (!isOnMd || showFormattingButtons);
  useEffect(() => {
    if (showToolbar) {
      cssVariables.setFormattingBar(barHeight);
    } else {
      (async () => {
        await formattingBarUnmountAnimationDelay();
        cssVariables.setFormattingBar(0);
      })();
    }
  }, [showToolbar, barHeight]);

  useEffect(() => {
    if (showRecentNodes) {
      cssVariables.setRecentNodes(40);
    } else {
      cssVariables.setRecentNodes(0);
    }
  }, [showRecentNodes]);

  const dialogIsShown =
    showSearchDialog || showSettingsDialog || showDocumentList || showBookmarks;
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
