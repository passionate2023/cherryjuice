import { HotKey } from '::types/graphql/generated';

const findDuplicate = <T>(arr: T[]): { index: number } => {
  let index;
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element) {
      const duplicateIndex = arr.indexOf(element);
      if (duplicateIndex !== i) {
        index = duplicateIndex;
      }
    }
  }
  return { index };
};

const findDuplicateHotkeys = (hotKeys: HotKey[]): HotKey => {
  const { index } = findDuplicate(hotKeys.map(hk => hk.keys));
  return hotKeys[index];
};

export { findDuplicate, findDuplicateHotkeys };
