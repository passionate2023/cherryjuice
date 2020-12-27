import { useEffect } from 'react';
import { hotKeysManager } from '@cherryjuice/hotkeys';
import { registerDevHKs, registerFormattingHKs } from '@cherryjuice/editor';
import { registerGeneralHKs } from '../register-general-hotkeys';
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
