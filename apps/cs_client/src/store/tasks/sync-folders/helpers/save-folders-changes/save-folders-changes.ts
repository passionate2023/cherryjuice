import { filterChanges } from '::store/tasks/sync-folders/helpers/save-folders-changes/helpers/filter-changes';
import { apolloClient } from '::graphql/client/apollo-client';
import { REMOVE_FOLDERS } from '::graphql/mutations/user-meta/remove-folders';
import { CREATE_FOLDERS } from '::graphql/mutations/user-meta/create-folders';
import { UPDATE_FOLDERS } from '::graphql/mutations/user-meta/update-folders';
import { HomeReducerState } from '::store/ducks/home/home';

export const saveFoldersChanges = async (
  home: HomeReducerState,
): Promise<void> => {
  const foldersDict = home.folders;
  const { folders: foldersChanges } = home.changes;
  const filteredFoldersChanges = filterChanges({
    created: foldersChanges.created,
    deleted: foldersChanges.deleted,
    updated: Object.keys(foldersChanges.edited),
  });
  if (filteredFoldersChanges.deleted.length)
    await apolloClient.mutate(
      REMOVE_FOLDERS({
        input: filteredFoldersChanges.deleted,
      }),
    );

  if (filteredFoldersChanges.created.length)
    await apolloClient.mutate(
      CREATE_FOLDERS({
        input: filteredFoldersChanges.created.map(id => foldersDict[id]),
      }),
    );
  if (filteredFoldersChanges.updated.length)
    await apolloClient.mutate(
      UPDATE_FOLDERS({
        input: filteredFoldersChanges.updated.map(id => {
          const updateFolderIt = { id };
          foldersChanges.edited[id].forEach(key => {
            updateFolderIt[key] = foldersDict[id][key];
          });
          return updateFolderIt;
        }),
      }),
    );
};
