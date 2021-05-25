import { HomeReducerState } from '::store/ducks/home/home';

export type SetFolderNamePayload = { id: string; name: string };

export const setFolderName = ({ id, name }: SetFolderNamePayload) => (
  state: HomeReducerState,
): HomeReducerState => {
  if (!state.folders[id]) return state;
  const isCurrentFolder =
    state.folders[id].name.toLowerCase() === state.folder.name;
  if (isCurrentFolder) state.folder = { name: name.toLowerCase(), id };
  state.folders[id].name = name;
  if (!state.changes.folders.edited[id]) state.changes.folders.edited[id] = [];
  state.changes.folders.edited[id].push('name');
  return state;
};
