import { useEffect } from 'react';
import { setupClipboard } from '::helpers/editing/clipboard';
import { setupTabAndBackspaceHandler } from '::helpers/editing/typing';
import { modRichText } from '::sass-modules';
import { ac } from '::store/store';
import { setupGesturesHandler } from '::root/components/shared-components/drawer/components/drawer-navigation/helpers/setup-gesture-handler';

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
