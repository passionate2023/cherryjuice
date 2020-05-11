import gql from 'graphql-tag';
import { AuthUser } from '::types/graphql/generated';
import { FRAGMENT_USER } from '::graphql/fragments';

const DOCUMENT_MUTATION = {
  file: gql`
    mutation($files: [Upload!]!) {
      document {
        uploadFile(files: $files)
      }
    }
  `,
  grdrive: gql`
    mutation($file: UploadLinkInputType!) {
      document {
        uploadLink(file: $file)
      }
    }
  `,
  deleteDocument: gql`
    mutation deleteDocument($documents: DeleteDocumentInputType!) {
      document {
        deleteDocument(documents: $documents)
      }
    }
  `,
  ahtml: gql`
    mutation saveAhtml(
      $file_id: String!
      $node_id: String!
      $ahtml: String!
      $deletedImages: [String]!
    ) {
      document(file_id: $file_id) {
        node(node_id: $node_id) {
          saveAHtml(ahtml: $ahtml, deletedImages: $deletedImages)
        }
      }
    }
  `,
  meta: gql`
    mutation meta($file_id: String!, $node_id: String!, $meta: NodeMetaIt!) {
      document(file_id: $file_id) {
        node(node_id: $node_id) {
          meta(meta: $meta)
        }
      }
    }
  `,
  createNode: {
    path: (data): string => data?.document?.node?.createNode,
    query: gql`
      mutation createNode(
        $file_id: String!
        $node_id: String!
        $meta: CreateNodeIt!
      ) {
        document(file_id: $file_id) {
          node(node_id: $node_id) {
            createNode(meta: $meta)
          }
        }
      }
    `,
  },
};

const USER_MUTATION = {
  signIn: {
    path: (data): AuthUser | undefined => data?.user?.signIn,
    query: gql`
      mutation signin($input: SignInCredentials!) {
        user {
          signIn(credentials: $input) {
            token
            user {
              ...UserInfo
            }
          }
        }
      }
      ${FRAGMENT_USER.userInfo}
    `,
  },
  signUp: {
    path: (data): AuthUser | undefined => data?.user?.signUp,
    query: gql`
      mutation signup($input: SignUpCredentials!) {
        user {
          signUp(credentials: $input) {
            token
            user {
              ...UserInfo
            }
          }
        }
      }
      ${FRAGMENT_USER.userInfo}
    `,
  },
};

export { DOCUMENT_MUTATION, USER_MUTATION };
