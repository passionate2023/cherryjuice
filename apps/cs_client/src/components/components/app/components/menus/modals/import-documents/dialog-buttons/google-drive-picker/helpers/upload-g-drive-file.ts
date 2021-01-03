import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { GooglePickerResult } from '::types/google';
import { apolloClient } from '::graphql/client/apollo-client';
import { gapiAuth2 } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/gapi-auth2/gapi-auth2';

export const uploadGDriveFile = (res: GooglePickerResult) => {
  if (res.action === 'picked') {
    const IDs = res.docs.map(({ id }) => id);
    const token = gapiAuth2.token;
    if (IDs.length && token) {
      apolloClient.mutate({
        path: () => undefined,
        query: DOCUMENT_MUTATION.grdrive,
        variables: {
          file: {
            access_token: token,
            IDs,
          },
        },
      });
    }
  }
};
