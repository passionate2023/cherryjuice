import gql from 'graphql-tag';
import { CreateFolderIt } from '@cherryjuice/graphql-types';

type Variables = {
  input: CreateFolderIt[];
};

export const CREATE_FOLDERS = (variables: Variables) => ({
  variables,
  path: (): void => undefined,
  query: gql`
    mutation create_folders($input: [CreateFolderIt!]!) {
      userMeta {
        createFolders(folders: $input)
      }
    }
  `,
});
