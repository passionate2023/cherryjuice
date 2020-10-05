import { useEffect, useRef } from 'react';
import loadScript from 'load-script';
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

const useLoadGoogleSDK = ({ isGoogleReady, onApiLoad }) => {
  const scriptLoadingStarted = useRef(false);
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
};

export { useLoadGoogleSDK };
