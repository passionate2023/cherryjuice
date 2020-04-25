// a fork of https://github.com/sdoomz/react-google-picker/blob/master/src/react-google-picker.js
import React, { useMemo, useRef } from 'react';
import { GooglePickerResult } from '::types/google';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { useCallback } from 'react';
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
    appActionCreators.setAlert({
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
