import {
  defaultFolderChanges,
  HomeReducerState,
} from '::store/ducks/home/home';
import { Folder } from '@cherryjuice/graphql-types';
import { cloneObj } from '@cherryjuice/shared-helpers';
export type FetchFoldersPayload = Folder[];
export const loadFetchedFolders = (folders: FetchFoldersPayload) => (
  state: HomeReducerState,
): HomeReducerState => {
  folders.forEach(folder => {
    if (folder.name === 'Drafts') {
      state.draftsFolderId = folder.id;
      if (!state.folder.id) {
        state.folder = {
          id: folder.id,
          name: folder.name.toLowerCase(),
        };
      }
    }
    state.folders[folder.id] = folder;
  });
  state.changes = cloneObj(defaultFolderChanges);
  state.asyncOperations.fetchFolders = 'idle';
  return state;
};
