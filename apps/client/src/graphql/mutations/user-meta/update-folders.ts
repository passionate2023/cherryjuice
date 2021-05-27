import gql from 'graphql-tag';
import { UpdateFolderIt } from '@cherryjuice/graphql-types';

type Variables = {
  input: UpdateFolderIt[];
};

export const UPDATE_FOLDERS = (variables: Variables) => ({
  variables,
  path: (): void => undefined,
  query: gql`
    mutation update_folders($input: [UpdateFolderIt!]!) {
      userMeta {
        updateFolders(folders: $input)
      }
    }
  `,
});
