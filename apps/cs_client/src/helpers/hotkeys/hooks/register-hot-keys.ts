import { useEffect } from 'react';
import { hotKeysManager } from '../hotkeys-manager';
import {
  registerFormattingHKs,
  registerGeneralHKs,
  registerDevHKs,
} from '../register-hot-keys';
import { HotKeys } from '@cherryjuice/graphql-types';

const useRegisterHotKeys = (hotKeys: HotKeys) => {
  useEffect(() => {
    hotKeysManager.startListening();
  }, []);
  useEffect(() => {
    hotKeysManager.unregisterAllHotKeys();
    if (hotKeys) {
      registerGeneralHKs(hotKeys?.general);
      registerFormattingHKs(hotKeys?.formatting);
      registerDevHKs();
    }
  }, [hotKeys]);
};

export { useRegisterHotKeys };
