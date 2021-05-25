import { showPicker } from '::app/components/menus/modals/import-documents/dialog-buttons/google-drive-picker/helpers/google-picker/show-picker';

export const googlePicker = {
  show: showPicker,
  get isReady() {
    // @ts-ignore
    return !!window.google?.picker;
  },
};
