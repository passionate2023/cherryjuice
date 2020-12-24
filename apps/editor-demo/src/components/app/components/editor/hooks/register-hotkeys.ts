import { useEffect } from 'react';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { registerFormattingHKs } from '@cherryjuice/editor';
import { hotKeysManager } from '@cherryjuice/hotkeys';
import { registerGeneralHKs } from '::root/app/components/editor/hooks/helpers/general-hotkeys';

export const useRegisterHotkeys = () => {
  useEffect(() => {
    hotKeysManager.startListening();
    const { formatting, general } = getDefaultSettings().hotKeys;
    registerFormattingHKs(formatting);
    registerGeneralHKs(general);
  }, []);
};
