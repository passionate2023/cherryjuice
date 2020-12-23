// a fork of https://github.com/sdoomz/react-google-picker/blob/master/src/react-google-picker.js
import React, { useMemo, useRef } from 'react';
import { GooglePickerResult } from '::types/google';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { useCallback } from 'react';
import { AlertType } from '::types/react';
import { useMutation } from '@apollo/react-hooks';
import { googlePickerDefaultProps, googlePickerHelpers } from './helpers';
import { useLoadGoogleSDK } from '::hooks/use-google-sdk';
import { ButtonSquare } from '@cherryjuice/components';
import { modImportDocument } from '::sass-modules';
import { Icons, Icon } from '@cherryjuice/icons';
import { ac } from '::store/store';
import { Secrets } from '@cherryjuice/graphql-types';

type Props = {
  secrets: Secrets;
};

const GoogleDrivePicker: React.FC<Props> = ({ secrets }) => {
  const [mutate] = useMutation(DOCUMENT_MUTATION.grdrive);
  const tokenRef = useRef('');

  const onFileSelect = useCallback(
    (res: GooglePickerResult) => {
      if (res.action === 'picked') {
        const IDs = res.docs.map(({ id }) => id);
        if (IDs.length && tokenRef.current) {
          mutate({
            variables: {
              file: {
                access_token: tokenRef.current,
                IDs,
              },
            },
          });
        }
      }
    },
    [tokenRef.current],
  );
  const onAuthFailed = error =>
    ac.dialogs.setAlert({
      error,
      type: AlertType.Error,
      description: error.message,
      title: 'could not upload files',
    });
  const onAuthenticate = useCallback(token => {
    tokenRef.current = token;
  }, []);
  const { isGoogleReady, onApiLoad, onChoose } = useMemo(
    () =>
      googlePickerHelpers({
        ...googlePickerDefaultProps,
        onAuthenticate,
        onChange: onFileSelect,
        onAuthFailed,
        clientId: secrets.google_client_id,
        developerKey: secrets.google_api_key,
      }),
    [],
  );
  useLoadGoogleSDK({ onApiLoad, isGoogleReady });
  return (
    <ButtonSquare
      onClick={onChoose}
      className={modImportDocument.importDocument__button}
      text={'google drive'}
      icon={
        <Icon
          {...{
            name: Icons.material['google-drive'],
            className: modImportDocument.importDocument__button__icon,
          }}
        />
      }
    />
  );
};

export { GoogleDrivePicker };
