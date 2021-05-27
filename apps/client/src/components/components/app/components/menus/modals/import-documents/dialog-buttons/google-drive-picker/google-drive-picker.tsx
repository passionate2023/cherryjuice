// a fork of https://github.com/sdoomz/react-google-picker/blob/master/src/react-google-picker.js
import React from 'react';
import { AlertType } from '::types/react';
import { useLoadGapi } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/hooks/load-gapi';
import { ButtonSquare } from '@cherryjuice/components';
import { modImportDocument } from '::sass-modules';
import { Icon } from '@cherryjuice/icons';
import { ac } from '::store/store';
import { Secrets } from '@cherryjuice/graphql-types';
import { uploadGDriveFile } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/upload-g-drive-file';
import { googlePicker } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/google-picker/google-picker';
const onAuthFailed = error =>
  ac.dialogs.setAlert({
    error,
    type: AlertType.Error,
    description: error.message,
    title: 'could not upload files',
  });

type Props = {
  secrets: Secrets;
};

const GoogleDrivePicker: React.FC<Props> = ({ secrets }) => {
  const sgp = googlePicker.show({
    clientId: secrets.google_client_id,
    onAuthFailed,
    pickerProps: {
      onPickerChange: uploadGDriveFile,
    },
  });
  const ready = useLoadGapi();
  return (
    <ButtonSquare
      disabled={!ready}
      onClick={sgp}
      className={modImportDocument.importDocument__button}
      text={'google drive'}
      icon={
        <Icon
          name={'google-drive'}
          className={modImportDocument.importDocument__button__icon}
        />
      }
    />
  );
};

export { GoogleDrivePicker };
