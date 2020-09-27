import { HotKeyActionType } from '::types/graphql';
import { ac, store } from '::store/store';
import { getDocumentHasUnsavedChanges } from '::store/selectors/cache/document/document';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';

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
    if (document.activeElement.id === 'rich-text')
      snapBackManager.current.undo();
    else ac.documentCache.undoDocumentAction();
  },
  [HotKeyActionType.REDO]: () => {
    if (document.activeElement.id === 'rich-text')
      snapBackManager.current.redo();
    else ac.documentCache.redoDocumentAction();
  },
  [HotKeyActionType.INSERT_ANCHOR]: () => {
    if (document.activeElement.id === 'rich-text')
      ac.dialogs.showAnchorDialog();
  },
  [HotKeyActionType.INSERT_LINK]: () => {
    if (document.activeElement.id === 'rich-text') ac.dialogs.showLinkDialog();
  },
};
