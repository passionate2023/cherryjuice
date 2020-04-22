// a fork of https://github.com/sdoomz/react-google-picker/blob/master/src/react-google-picker.js
import React, { useEffect, useMemo, useRef } from 'react';
import loadScript from 'load-script';
import { GooglePicker } from './index';
import { GooglePickerResult } from '::types/google';
import { useMutation } from '@apollo/react-hooks';
import { UPLOAD_DOCUMENT } from '::graphql/mutations';
import { useCallback, useState } from 'react';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react'
import { useMutation } from '@apollo/react-hooks';
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

type TProps = {
  clientId: string;
  onChange: Function;
  onAuthenticate: Function;
  onAuthFailed: Function;
  createPicker?: Function;
  developerKey: string;
  scope?: string[];
  viewId?: string;
  authImmediate?: boolean;
  origin?: string;
  multiselect?: boolean;
  navHidden?: boolean;
  disabled?: boolean;
  mimeTypes?: string[];
  query?: string;
};
const defaultProps = {
  viewId: 'DOCS',
  authImmediate: false,
  multiselect: false,
  navHidden: false,
  disabled: false,
  mimeTypes: [],
  query: '',
};

const googleHelpers = ({
  authImmediate,
  clientId,
  developerKey,
  disabled,
  multiselect,
  navHidden,
  scope,
  viewId,
  onChange,
  onAuthFailed,
  onAuthenticate,
  query,
  mimeTypes,
  createPicker: propsCreatePicker,
}: TProps) => {
  const isGoogleReady = () => {
    return !!window.gapi;
  };

  const isGoogleAuthReady = () => {
    return !!window.gapi.auth;
  };

  const isGooglePickerReady = () => {
    return !!window.google.picker;
  };
  const onApiLoad = () => {
    window.gapi.load('auth', undefined);
    window.gapi.load('picker', undefined);
  };
  const doAuth = ({ callback, clientId, scope, authImmediate }) => {
    window.gapi.auth.authorize(
      {
        client_id: clientId,
        scope: scope,
        immediate: authImmediate,
      },
      callback,
    );
  };

  const createPicker = oauthToken => {
    onAuthenticate(oauthToken);

    if (propsCreatePicker) {
      return propsCreatePicker(window.google, JSON.stringify(oauthToken));
    }

    const googleViewId = window.google.picker.ViewId[viewId];
    const view = new window.google.picker.View(googleViewId);

    if (mimeTypes) {
      view.setMimeTypes(mimeTypes.join(','));
    }
    if (query) {
      view.setQuery(query);
    }

    if (!view) {
      throw new Error("Can't find view by viewId");
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(developerKey)
      .setCallback(onChange);

    if (origin) {
      picker.setOrigin(origin);
    }

    if (navHidden) {
      picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
    }

    if (multiselect) {
      picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
    }

    picker.build().setVisible(true);
  };

  const getToken = () => {
    const savedToken = localStorage.getItem('gapi.auth.token');
    if (savedToken) return JSON.parse(savedToken);
    else return window.gapi.auth.getToken();
  };
  const saveToken = token => {
    localStorage.setItem('gapi.auth.token', JSON.stringify(token));
  };
  const onChoose = () => {
    if (
      !isGoogleReady() ||
      !isGoogleAuthReady() ||
      !isGooglePickerReady() ||
      disabled
    ) {
      return null;
    }

    const token = getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      createPicker(oauthToken);
    } else {
      doAuth({
        callback: response => {
          if (response.access_token) {
            saveToken(response);
            createPicker(response.access_token);
          } else {
            onAuthFailed(response);
          }
        },
        authImmediate,
        clientId,
        scope,
      });
    }
  };
  return { isGoogleReady, onApiLoad, onChoose };
};
const GooglePicker: React.FC<TProps> = props => {
  const scriptLoadingStarted = useRef(false);

  const { isGoogleReady, onApiLoad, onChoose } = useMemo(
    () => googleHelpers({ ...defaultProps, ...props }),
    [props],
  );

  useEffect(() => {
    if (isGoogleReady()) {
      // google api is already exists
      // init immediately
      onApiLoad();
    } else if (!scriptLoadingStarted.current) {
      // load google api and the init
      scriptLoadingStarted.current = true;
      loadScript(GOOGLE_SDK_URL, onApiLoad);
    } else {
      // is loading
    }
  }, []);
  return <button onClick={onChoose}>Open google chooser</button>;
};
type Props = {};

const GoogleDrivePicker: React.FC<Props> = () => {
  const [mutate] = useMutation(UPLOAD_DOCUMENT.grdrive);
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
  return (
    <GooglePicker
      clientId={
        '622784255409-3gl2p283pqkqnhvr65cghrbdpigvsifk.apps.googleusercontent.com'
      }
      developerKey={'AIzaSyDBGrwe51vtHuMbDG1Jbpa-8i13nXja62w'}
      scope={[
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
      ]}
      multiselect={true}
      onChange={onFileSelect}
      onAuthFailed={error =>
        appActionCreators.setAlert({
          error,
          type: AlertType.Error,
          description: error.message,
          title: 'could not upload files',
        })
      }
      onAuthenticate={setToken}
      mimeTypes={['application/octet-stream']}
      query={'*.ctb'}
    />
  );
};

export { GoogleDrivePicker };
