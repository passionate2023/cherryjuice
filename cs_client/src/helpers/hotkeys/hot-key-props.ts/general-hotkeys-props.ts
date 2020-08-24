import { HotKeyActionType } from '::types/graphql/generated';
import { ac, store } from '::store/store';
import { getDocumentHasUnsavedChanges } from '::store/selectors/cache/document/document';

export const generalHotKeysProps = {
  [HotKeyActionType.SAVE_DOCUMENT]: () => {
    ac.document.save();
  },
  [HotKeyActionType.RELOAD_DOCUMENT]: () => {
    getDocumentHasUnsavedChanges(store.getState())
      ? ac.dialogs.showReloadDocument()
      : ac.document.fetch();
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
  [HotKeyActionType.UNDO]: () => {
    if (store.getState().dialogs.showDocumentList)
      ac.documentCache.undoDocumentMeta();
    else ac.documentCache.undoNodeMeta();
  },
  [HotKeyActionType.REDO]: () => {
    if (store.getState().dialogs.showDocumentList)
      ac.documentCache.redoDocumentMeta();
    else ac.documentCache.redoNodeMeta();
  },
};
