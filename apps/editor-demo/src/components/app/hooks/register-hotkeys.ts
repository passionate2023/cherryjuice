import { useEffect } from 'react';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { registerFormattingHKs } from '@cherryjuice/editor';
import { hotKeysManager } from '@cherryjuice/hotkeys';

export const useRegisterHotkeys = () => {
  useEffect(() => {
    hotKeysManager.startListening();
    const formatting = getDefaultSettings().hotKeys.formatting;
    registerFormattingHKs(formatting);
  }, []);
};
