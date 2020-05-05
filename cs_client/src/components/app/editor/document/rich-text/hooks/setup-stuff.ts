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

const useSetupStuff = () => {
  useEffect(() => {
    setupClipboard();
    setupKeyboardEvents();
    setupFormattingHotKeys();
    setupDevHotKeys();
    hotKeysManager.startListening();
    setupGesturesHandler({
      onRight: appActionCreators.showTree,
      onLeft: appActionCreators.hideTree,
      onTap: appActionCreators.hidePopups,
      gestureZoneSelector: modRichText.richText,
      minimumLength: 170,
    });
  }, []);
};

export { useSetupStuff };
