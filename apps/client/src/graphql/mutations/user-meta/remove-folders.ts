import gql from 'graphql-tag';

type Variables = {
  input: string[];
};

export const REMOVE_FOLDERS = (variables: Variables) => ({
  variables,
  path: (): void => undefined,
  query: gql`
    mutation remove_folders($input: [String!]!) {
      userMeta {
        removeFolders(folderIds: $input)
      }
    }
  `,
});
