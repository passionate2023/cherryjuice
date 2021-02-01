import { HomeReducerState } from '::store/ducks/home/home';

export type SelectFolderPayload = { name?: string; id?: string };
export const selectFolder = ({ id, name }: SelectFolderPayload) => (
  state: HomeReducerState,
): HomeReducerState => {
  name = (name || state.folders[id]?.name).toLowerCase();
  id =
    id ||
    Object.values(state.folders).filter(
      _folder => _folder.name.toLowerCase() === name,
    )[0]?.id;
  const drafts = state.folders[state.draftsFolderId];
  if (!name || !id) {
    state.folder = {
      id: drafts.id,
      name: drafts.name.toLowerCase(),
    };
  } else state.folder = { id, name };
  state.show = true;

  return state;
};
