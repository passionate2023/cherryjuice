import { useEffect, useState } from 'react';
import loadScript from 'load-script';
import { gapiAuth2 } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/gapi-auth2/gapi-auth2';
import { googlePicker } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/google-picker/google-picker';
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

const state = {
  loadingGapi: false,
  loadingAuth: false,
  loadingPicker: false,
};

const loadAuth2 = async () => {
  return new Promise<void>(res => {
    if (!gapiAuth2.isReady && !state.loadingAuth) {
      state.loadingAuth = true;
      window.gapi.load('auth2', () => {
        state.loadingAuth = false;
        res();
      });
    } else res();
  });
};

const loadPicker = () => {
  return new Promise<void>(res => {
    if (!googlePicker.isReady && !state.loadingPicker) {
      state.loadingPicker = true;
      window.gapi.load('picker', () => {
        state.loadingPicker = false;
        res();
      });
    } else res();
  });
};

export const loadGapi = () => {
  return new Promise<void>(res => {
    if (!window.gapi) {
      state.loadingGapi = true;
      loadScript(GOOGLE_SDK_URL, () => {
        state.loadingGapi = false;
        res();
      });
    } else res();
  });
};

const useLoadGapi = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadGapi()
      .then(loadAuth2)
      .then(loadPicker)
      .then(() => setReady(true));
  }, []);
  return ready;
};

export { useLoadGapi };
