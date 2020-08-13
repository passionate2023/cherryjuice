import { useEffect } from 'react';
import { hotKeysManager } from '../hotkeys-manager';
import {
  registerFormattingHKs,
  registerDocumentHKs,
  registerDevHKs,
} from '../register-hot-keys';
import { UserHotkeys } from '::helpers/hotkeys/fetched';

const useRegisterHotKeys = (userHotKeys: UserHotkeys) => {
  useEffect(() => {
    hotKeysManager.startListening();
  }, []);
  useEffect(() => {
    hotKeysManager.unregisterAllHotKeys();
    registerDocumentHKs(userHotKeys?.document?.hotkeys);
    registerFormattingHKs(userHotKeys?.formatting?.hotkeys);
    registerDevHKs();
  }, [userHotKeys]);
};

export { useRegisterHotKeys };
