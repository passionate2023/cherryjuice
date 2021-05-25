import { bridge, pagesManager } from '@cherryjuice/editor';
import { ac, store } from '::store/store';
import { AlertType } from '::types/react';
import { getDocuments } from '::store/selectors/cache/document/document';
import { FormattingError } from '@cherryjuice/editor';
import { LinkType } from '::root/components/app/components/menus/dialogs/link/reducer/reducer';
import { useEffect } from 'react';

export const initBridge = () => {
  pagesManager.resetPages(() => true);
  pagesManager.setConfiguration({ autoSaveInterval: 5000 });
  bridge.current.selectNode = ac.node.select;
  bridge.current.onPasteImageErrorHandler = error =>
    ac.dialogs.setAlert({
      title: 'could not download the pasted image',
      type: AlertType.Error,
      description: 'verify your network connection',
      error,
    });
  bridge.current.onTypingError = error =>
    ac.dialogs.setAlert({
      title: 'Something went wrong',
      description: 'Please submit a bug report',
      type: AlertType.Error,
      error,
    });
  bridge.current.setScrollPosition = ac.documentCache.setScrollPosition;
  bridge.current.saveHtml = ({
    deletedImages,
    newImages,
    documentId,
    node_id,
    html,
  }) =>
    ac.documentCache.mutateNodeContent({
      node_id,
      documentId,
      data: {
        html,
        image: newImages,
      },
      meta: { deletedImages },
    });
  bridge.current.getNodeImageIDsFromCache = ({
    node_id,
    documentId,
  }): string[] => {
    const document = getDocuments(store.getState())[documentId];
    return document ? document.nodes[node_id].image.map(image => image.id) : [];
  };
  bridge.current.onPasteErrorHandler = error => {
    ac.dialogs.setAlert({
      title: 'Could not perform the paste',
      description: 'Please submit a bug report',
      error,
      type: AlertType.Error,
    });
  };
  bridge.current.onFormattingErrorHandler = error =>
    ac.dialogs.setSnackbar({
      lifeSpan: 2000,
      type: AlertType.Warning,
      message:
        error instanceof FormattingError
          ? error.message
          : 'Could not perform the action',
    });
  bridge.current.editAnchor = (id: string) => {
    ac.editor.setAnchorId(id);
    ac.dialogs.showAnchorDialog();
  };
  bridge.current.editLink = (target: HTMLElement) => {
    ac.editor.setSelectedLink({
      href: decodeURIComponent(target['href'] || target.dataset['href']),
      type: target.dataset.type as LinkType,
      target,
    });
    ac.dialogs.showLinkDialog();
  };

  bridge.current.editCodebox = (target: HTMLElement) => {
    ac.editor.setSelectedCodebox({
      widthType: +target.dataset['is_width_pix'] === 1 ? 'pixels' : '%',
      width: +target.style.width.replace(/(px|%)/, ''),
      height:
        +target.style.height.replace('px', '') ||
        +target.style.minHeight.replace('px', ''),
      autoExpandHeight: target.style.height ? 'fixed' : 'auto',
      target,
    });
    ac.dialogs.showCodeboxDialog();
  };

  bridge.current.editTable = (target: HTMLTableElement) => {
    ac.editor.setSelectedTable({
      rows: target.tBodies[0].childElementCount,
      columns: target.tHead.firstElementChild.childElementCount,
      target,
    });
    ac.dialogs.showTableDialog();
  };
  bridge.current.flagEditedNode = ({ node_id, documentId, changed }) =>
    ac.documentCache.mutateNodeContent({
      node_id,
      documentId,
      data: { html: '' },
      meta: { flag: changed ? 'list' : 'unlist' },
    });
  bridge.current.getDocumentId = () => store.getState().document.documentId;
};

export const useInitEditorBridge = () => {
  useEffect(() => {
    initBridge();
  }, []);
};
