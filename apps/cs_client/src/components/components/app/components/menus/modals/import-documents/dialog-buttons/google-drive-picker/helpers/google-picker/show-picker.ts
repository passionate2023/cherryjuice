import {
  createPicker,
  CreatePickerProps,
} from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/google-picker/create-picker';
import { gapiAuth2 } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/gapi-auth2/gapi-auth2';
import { googlePicker } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/google-picker/google-picker';

export type ShowGooglePickerProps = {
  clientId: string;
  onAuthFailed: (error: Error) => void;
  pickerProps: Omit<CreatePickerProps, 'oauthToken'>;
};

export const showPicker = ({
  pickerProps,
  onAuthFailed,
  clientId,
}: ShowGooglePickerProps) => () => {
  if (!googlePicker.isReady || !gapiAuth2.isReady) return;

  if (gapiAuth2.token) {
    createPicker(pickerProps);
  } else {
    gapiAuth2
      .authorize({
        clientId,
      })
      .then(() => {
        createPicker(pickerProps);
      })
      .catch(onAuthFailed);
  }
};
