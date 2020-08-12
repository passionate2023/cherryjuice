import { useEffect } from 'react';
import {
  hkActionCreators,
  HKState,
} from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';
import {
  findDuplicateHotkeys,
  flattenHotKey,
} from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/hooks/find-duplicates/helpers';

type FindDuplicatesProps = { state: HKState };

const useFindDuplicates = ({ state }: FindDuplicatesProps) => {
  useEffect(() => {
    const [hotKey] = findDuplicateHotkeys(Object.values(state.hotKeys));
    if (hotKey) {
      const actualDuplicates = Object.values(state.hotKeys).filter(
        hk =>
          hk.keysCombination && flattenHotKey(hk.keysCombination) === hotKey,
      );
      hkActionCreators.setDuplicateHotkeys(actualDuplicates.map(hk => hk.type));
    } else hkActionCreators.setDuplicateHotkeys([]);
  }, [state.hotKeys]);
};

export { useFindDuplicates };
