import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { hotKeysManager, HotKeyTarget } from '@cherryjuice/hotkeys';
import { createTestSample } from '::helpers/hotkeys/dev/create-test-sample';

export const registerDevHKs = () => {
  hotKeysManager.registerHotKey({
    keys: '¤110',
    callback: createTestSample,
    options: { target: HotKeyTarget.GLOBAL },
    type: HotKeyActionType.CREATE_TEST_SAMPLE,
  });
};
