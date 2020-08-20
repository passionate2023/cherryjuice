import { useEffect } from 'react';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import { formattingBarUnmountAnimationDelay } from '::root/components/app/components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';

export const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  treeWidth: number,
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
};