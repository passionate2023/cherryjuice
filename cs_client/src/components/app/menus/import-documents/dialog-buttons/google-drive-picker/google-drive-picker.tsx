// a fork of https://github.com/sdoomz/react-google-picker/blob/master/src/react-google-picker.js
import React, { useMemo } from 'react';
import { GooglePickerResult } from '::types/google';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { useCallback, useState } from 'react';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';
import { useMutation } from '@apollo/react-hooks';
import { googlePickerDefaultProps, googlePickerHelpers } from './helpers';
import { useLoadGoogleSDK } from '::hooks/use-google-sdk';
import { ButtonSquare } from '::shared-components/buttons/buttonSquare';
import { modImportDocument } from '::sass-modules/index';
import { Icons, Icon } from '::shared-components/icon';

type Props = {};

const GoogleDrivePicker: React.FC<Props> = () => {
  const [mutate] = useMutation(DOCUMENT_MUTATION.grdrive);
  const [token, setToken] = useState('');

  const onFileSelect = useCallback(
    (res: GooglePickerResult) => {
      if (res.action === 'picked') {
        const IDs = res.docs.map(({ id }) => id);
        if (IDs.length && token) {
          mutate({
            variables: {
              file: {
                access_token: token,
                IDs,
              },
            },
          });
        }
      }
    },
    [token],
  );
  const onAuthFailed = error =>
    appActionCreators.setAlert({
      error,
      type: AlertType.Error,
      description: error.message,
      title: 'could not upload files',
    });
  const { isGoogleReady, onApiLoad, onChoose } = useMemo(
    () =>
      googlePickerHelpers({
        ...googlePickerDefaultProps,
        onAuthenticate: setToken,
        onChange: onFileSelect,
        onAuthFailed,
      }),
    [],
  );
  useLoadGoogleSDK({ onApiLoad, isGoogleReady });
  return (
    <ButtonSquare
      onClick={onChoose}
      className={modImportDocument.importDocument__button}
    >
      <Icon
        name={Icons.material['google-drive']}
        small={true}
        className={modImportDocument.importDocument__button__icon}
      />
      google drive
    </ButtonSquare>
  );
};

export { GoogleDrivePicker };
