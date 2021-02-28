import { createSelector } from 'reselect';
import { Store } from '::store/store';

const showSearchDialog = (state: Store) => state.search.searchState !== 'idle';
const showSettingsDialog = (state: Store) => state.dialogs.showSettingsDialog;
const showBookmarks = (state: Store) => state.dialogs.showBookmarks;

export const aPinnableDialogIsShown = createSelector(
  showSearchDialog,
  showSettingsDialog,
  showBookmarks,
  (search, settings, bookmarks) => search || settings || bookmarks,
);
