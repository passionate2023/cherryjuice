import { v4 as uuidv4 } from 'uuid';
import { HomeReducerState, SortDocumentsBy } from '::store/ducks/home/home';

export type CreateFolderPayload = { userId: string };

export const createFolder = ({ userId }: CreateFolderPayload) => (
  state: HomeReducerState,
): HomeReducerState => {
  const id = uuidv4();
  state.folders[id] = {
    name: '',
    id,
    userId,
    settings: {
      sortDocumentsBy: SortDocumentsBy.DocumentName,
      icon: undefined,
    },
  };
  state.folder = { id, name: '' };
  state.changes.folders.created.push(id);
  return state;
};
