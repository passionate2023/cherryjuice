import gql from 'graphql-tag';
import {
  AuthUser,
  SignInCredentials,
  SignUpCredentials,
} from '::types/graphql/generated';
import { FRAGMENT_USER } from '::graphql/fragments';

const DOCUMENT_MUTATION = {
  file: gql`
    mutation($files: [CTBUpload!]!) {
      document {
        uploadFile(files: $files)
      }
    }
  `,
  grdrive: gql`
    mutation($file: UploadLinkInputType!) {
      document {
        uploadFromGDrive(file: $file)
      }
    }
  `,

  ahtml: {
    path: (data): string => data?.document?.node?.saveAHtml,
    query: gql`
      mutation saveAhtml(
        $file_id: String!
        $node_id: Int!
        $data: SaveHtmlIt!
      ) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            saveAHtml(data: $data)
          }
        }
      }
    `,
  },

  deleteNode: {
    path: (data): string => data?.document?.node?.deleteNode,
    query: gql`
      mutation deleteNode($file_id: String!, $node_id: Int!) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            deleteNode
          }
        }
      }
    `,
  },

  uploadImages: {
    path: (data): [string, string][] => data?.document?.node?.uploadImage,
    query: gql`
      mutation uploadImages(
        $file_id: String!
        $node_id: Int!
        $images: [ImageUpload!]!
      ) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            uploadImage(images: $images)
          }
        }
      }
    `,
  },
};

const USER_MUTATION = {
  refreshToken: {
    args: (): void => undefined,
    path: (data): AuthUser | undefined => data?.user?.signIn,
    query: gql`
      query refreshToekn {
        user {
          refreshToken {
            token
            user {
              ...UserInfo
            }
            secrets {
              google_api_key
              google_client_id
            }
          }
        }
      }
      ${FRAGMENT_USER.userInfo}
    `,
  },
  signIn: {
    args: (input: SignInCredentials) => ({ input }),
    path: (data): AuthUser | undefined => data?.user?.signIn,
    query: gql`
      mutation signin($input: SignInCredentials!) {
        user {
          signIn(credentials: $input) {
            token
            user {
              ...UserInfo
            }
            secrets {
              google_api_key
              google_client_id
            }
          }
        }
      }
      ${FRAGMENT_USER.userInfo}
    `,
  },
  signUp: {
    args: (input: SignUpCredentials) => ({ input }),
    path: (data): AuthUser | undefined => data?.user?.signUp,
    query: gql`
      mutation signup($input: SignUpCredentials!) {
        user {
          signUp(credentials: $input) {
            token
            user {
              ...UserInfo
            }
            secrets {
              google_api_key
              google_client_id
            }
          }
        }
      }
      ${FRAGMENT_USER.userInfo}
    `,
  },
};

export { DOCUMENT_MUTATION, USER_MUTATION };
