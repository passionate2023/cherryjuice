import { useEffect } from 'react';
import { hotKeysManager } from '../helpers/hotkeys-manager';
import {
  setupFormattingHotKeys,
  setupDocumentHotKeys,
  setupDevHotKeys,
} from '../helpers/setup-hotkeys';

const useSetupHotKeys = () => {
  useEffect(() => {
    hotKeysManager.startListening();
    setupDocumentHotKeys();
    setupFormattingHotKeys();
    setupDevHotKeys();
  }, []);
};

export { useSetupHotKeys };
