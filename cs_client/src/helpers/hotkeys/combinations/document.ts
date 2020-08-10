import { HotKey } from '../helpers/hotkeys-manager';
import { ac, store } from '::store/store';

const hotKeys: HotKey[] = [
  {
    hotKey: { key: 's', ctrlKey: true },
    callback: ac.document.save,
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
  {
    hotKey: { key: 'r', ctrlKey: true },
    callback: () => {
      store.getState().document.hasUnsavedChanges
        ? ac.dialogs.showReloadDocument()
        : ac.document.fetchNodes();
    },
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
  {
    hotKey: { key: 'o', ctrlKey: true },
    callback: ac.dialogs.showDocumentList,
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
  {
    hotKey: { key: 'i', altKey: true },
    callback: ac.dialogs.showImportDocument,
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
  {
    hotKey: { key: 'n', ctrlKey: true, altKey: true },
    callback: ac.dialogs.showCreateDocumentDialog,
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
  {
    hotKey: { key: 'n', altKey: true },
    callback: ac.dialogs.showCreateSiblingNode,
    options: {
      richTextHasToBeOnFocus: false,
    },
  },
];

export { hotKeys as documentHotKeys };
