export type TGooglePickerProps = {
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

const googlePickerHelpers = ({
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
}: TGooglePickerProps) => {
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
    // const savedToken = localStorage.getItem('gapi.auth.token');
    // if (savedToken) return JSON.parse(savedToken);
    return window.gapi.auth.getToken();
  };
  const saveToken = () => {
    // localStorage.setItem('gapi.auth.token', JSON.stringify(token));
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

const googlePickerDefaultProps = {
  viewId: 'DOCS',
  authImmediate: false,
  navHidden: false,
  disabled: false,
  clientId:
    '622784255409-3gl2p283pqkqnhvr65cghrbdpigvsifk.apps.googleusercontent.com', //process.env.OAUTH_GOOGLE_CLIENT_ID,
  developerKey: 'AIzaSyDBGrwe51vtHuMbDG1Jbpa', // process.env.OAUTH_GOOGLE_DEVELOPER_KEY,
  scope: [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
  ],
  multiselect: true,
  mimeTypes: ['application/octet-stream'],
  query: '*.ctb',
};

export { googlePickerHelpers, googlePickerDefaultProps };
