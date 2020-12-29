import { authorize } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/gapi-auth2/authorize';

export const gapiAuth2 = {
  authorize,
  get isReady() {
    return Boolean(window.gapi && window.gapi['auth2']);
  },
  get token() {
    return window.gapi['auth2']
      .getAuthInstance()
      ?.currentUser?.get()
      ?.getAuthResponse().access_token;
  },
};
