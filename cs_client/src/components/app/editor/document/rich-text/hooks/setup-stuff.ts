import { useEffect } from 'react';
import { setupClipboard } from '::helpers/editing/clipboard';
import { setupTabAndBackspaceHandler } from '::helpers/editing/typing';
import { setupGesturesHandler } from '::shared-components/drawer/drawer-navigation/helpers';
import { modRichText } from '::sass-modules/index';
import { ac } from '::root/store/store';

const useSetupStuff = node_id => {
  useEffect(() => {
    setupClipboard();
  }, [node_id]);
  useEffect(() => {
    setupTabAndBackspaceHandler();
    setupGesturesHandler({
      onRight: ac.editor.showTree,
      onLeft: ac.editor.hideTree,
      onTap: ac.root.hidePopups,
      gestureZoneSelector: modRichText.richText,
      minimumLength: 170,
    });
  }, []);
};

export { useSetupStuff };
