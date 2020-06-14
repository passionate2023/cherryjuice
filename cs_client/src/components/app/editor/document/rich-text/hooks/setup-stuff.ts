import { useEffect } from 'react';
import { setupClipboard } from '::helpers/editing/clipboard';
import { setupKeyboardEvents } from '::helpers/editing/typing';
import {
  hotKeysManager,
  setupDevHotKeys,
  setupFormattingHotKeys,
} from '::helpers/hotkeys';
import { setupGesturesHandler } from '::shared-components/drawer/drawer-navigation/helpers';
import { appActionCreators } from '::app/reducer';
import { modRichText } from '::sass-modules/index';
import { ac } from '::root/store/store';

const useSetupStuff = node_id => {
  useEffect(() => {
    setupClipboard();
  }, [node_id]);
  useEffect(() => {
    setupKeyboardEvents();
    setupFormattingHotKeys();
    setupDevHotKeys();
    hotKeysManager.startListening();
    setupGesturesHandler({
      onRight: ac.editor.showTree,
      onLeft: ac.editor.hideTree,
      onTap: appActionCreators.hidePopups,
      gestureZoneSelector: modRichText.richText,
      minimumLength: 170,
    });
  }, []);
};

export { useSetupStuff };
