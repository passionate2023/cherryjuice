import { KeysCombination } from '::helpers/hotkeys/hotkeys-manager';

export const hotKeyMatches = (
  e: KeyboardEvent | KeysCombination,
  b: KeysCombination,
) =>
  b.key === e.key &&
  b.ctrlKey === e.ctrlKey &&
  b.shiftKey === e.shiftKey &&
  b.altKey === e.altKey &&
  b.metaKey === e.metaKey;
