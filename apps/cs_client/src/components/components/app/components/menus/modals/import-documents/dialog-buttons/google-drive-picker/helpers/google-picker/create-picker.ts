import { gapiAuth2 } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/gapi-auth2/gapi-auth2';

export type CreatePickerProps = {
  onPickerChange: Function;
};

export type CreatePickerPreferences = {
  mimeTypes?: string[];
  query?: string;
  viewId: string;
  navHidden: boolean;
  multiselect: boolean;
  authImmediate: boolean;
};

export const createPicker = (
  { onPickerChange }: CreatePickerProps,
  {
    query,
    viewId,
    mimeTypes,
    navHidden,
    multiselect,
  }: CreatePickerPreferences = {
    viewId: 'DOCS',
    authImmediate: false,
    navHidden: false,
    multiselect: true,
    mimeTypes: ['application/octet-stream'],
    query: '*.ctb',
  },
) => {
  // @ts-ignore
  const gapiPicker = window.gapi.picker.api;
  const googleViewId = gapiPicker.ViewId[viewId];
  const view = new gapiPicker.View(googleViewId);

  if (!view) {
    throw new Error("Can't find view by viewId");
  }

  if (mimeTypes) {
    view.setMimeTypes(mimeTypes.join(','));
  }
  if (query) {
    view.setQuery(query);
  }

  const picker = new gapiPicker.PickerBuilder()
    .addView(view)
    .setOAuthToken(gapiAuth2.token)
    .setCallback(onPickerChange);

  if (navHidden) {
    picker.enableFeature(gapiPicker.Feature.NAV_HIDDEN);
  }

  if (multiselect) {
    picker.enableFeature(gapiPicker.Feature.MULTISELECT_ENABLED);
  }

  picker.build().setVisible(true);
};
