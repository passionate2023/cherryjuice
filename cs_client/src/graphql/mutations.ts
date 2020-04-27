import gql from 'graphql-tag';
import { AuthUser } from '::types/graphql/generated';
import { FRAGMENT_USER } from '::graphql/fragments';

const DOCUMENT_MUTATION = {
  file: gql`
    mutation($file: Upload!) {
      document {
        uploadFile(file: $file)
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
  html: gql`
    mutation ct_node_html(
      $file_id: String!
      $node_id: Int!
      $abstract_html: String!
    ) {
      ct_node_content(
        file_id: $file_id
        node_id: $node_id
        abstract_html: $abstract_html
      )
    }
  `,
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
