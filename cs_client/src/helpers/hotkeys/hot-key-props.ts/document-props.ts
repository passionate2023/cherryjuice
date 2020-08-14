import { HotKeyActionType } from '::types/graphql/generated';
import { ac, store } from '::store/store';

export const documentHotkeysProps = {
  [HotKeyActionType.SAVE_DOCUMENT]: () => {
    ac.document.save();
  },
  [HotKeyActionType.RELOAD_DOCUMENT]: () => {
    store.getState().document.hasUnsavedChanges
      ? ac.dialogs.showReloadDocument()
      : ac.document.fetchNodes();
  },
  [HotKeyActionType.SHOW_DOCUMENTS_LIST]: () => {
    ac.dialogs.showDocumentList();
  },
  [HotKeyActionType.SHOW_IMPORT_DOCUMENTS]: () => {
    ac.dialogs.showImportDocument();
  },
  [HotKeyActionType.SHOW_CREATE_DOCUMENT]: () => {
    ac.dialogs.showCreateDocumentDialog();
  },
  [HotKeyActionType.SHOW_CREATE_SIBLING_NODE]: () => {
    ac.dialogs.showCreateSiblingNode();
  },
};
