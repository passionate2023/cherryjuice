import gql from 'graphql-tag';
import { Folder } from '@cherryjuice/graphql-types';

export const FOLDERS = () => ({
  variables: undefined,
  path: (data): Folder => data?.userMeta?.folders,
  query: gql`
    query folders {
      userMeta {
        folders {
          id
          userId
          name
          settings {
            sortDocumentsBy
            icon
          }
        }
      }
    }
  `,
});
