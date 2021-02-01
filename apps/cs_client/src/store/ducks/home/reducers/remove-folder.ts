import { HomeReducerState } from '::store/ducks/home/home';

export type RemoveFolderPayload = {
  id: string;
};

export const removeFolder = ({ id }: RemoveFolderPayload) => (
  state: HomeReducerState,
): HomeReducerState => {
  delete state.folders[id];
  const draftsFolder = state.folders[state.draftsFolderId];
  state.folder = { id: draftsFolder.id, name: draftsFolder.name.toLowerCase() };
  state.changes.folders.deleted.push(id);
  return state;
};
