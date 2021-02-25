import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::app/components/editor/editor-toolbar/components/animated-editor-toolbar/animated-editor-toolbar';
import { filter, take, tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { modDialog } from '::shared-components/dialog/dialog';
import { ac, Store } from '::store/store';
import { useSelector } from 'react-redux';
import { CssVariables } from '::store/ducks/css-variables';
import { aDialogIsPinned } from '::store/selectors/layout/a-dialog-is-pinned';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

export const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  showRecentNodes: boolean,
  treeWidth: number,
  previousTreeWidth: number,
) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const showNodePath = useSelector((state: Store) => state.editor.showNodePath);
  const barHeight = mbOrTb ? 40 : 34;
  useEffect(() => {
    ac.cssVariables.set(CssVariables.nodePath, showNodePath ? barHeight : 0);
  }, [showNodePath, barHeight]);

  useEffect(() => {
    ac.cssVariables.set(
      CssVariables.treeWidth,
      showTree ? previousTreeWidth : 0,
    );
  }, [showTree, previousTreeWidth]);

  const showToolbar = isDocumentOwner && (!mbOrTb || showFormattingButtons);
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

  const pinnedDialog = useSelector(aDialogIsPinned);
  useEffect(() => {
    if (pinnedDialog) {
      ac.root.setDocking(false);
    } else {
      ac.root.setDocking(true);
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
  }, [pinnedDialog]);
};
