import { Store } from '::store/store';
import { createSelector } from 'reselect';
import { aPinnableDialogIsShown } from './a-pinnable-dialog-is-shown';

const pinDialogs = (state: Store) => state.root.dockedDialog;

export const aDialogIsPinned = createSelector(
  aPinnableDialogIsShown,
  pinDialogs,
  (shownDialog, pinDialogs) => shownDialog && pinDialogs,
);
