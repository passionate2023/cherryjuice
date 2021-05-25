import { ac } from '::store/store';

export const splitId = (cmiId = '') => {
  const [documentId, node_id] = cmiId.split('/');
  return { documentId, node_id: +(node_id || -1) };
};

export const copyNodeId = cmiId => {
  const { node_id } = splitId(cmiId);
  navigator.clipboard.writeText('' + node_id).then(() => {
    ac.dialogs.setSnackbar({ message: 'node ID copied to clipboard' });
  });
};

export const copyNodeLink = cmiId => {
  const { documentId, node_id } = splitId(cmiId);
  navigator.clipboard
    .writeText(`${location.origin}/document/${documentId}/node/${node_id}`)
    .then(() => {
      ac.dialogs.setSnackbar({ message: 'node link copied to clipboard' });
    });
};
export const copyNode = cmiId => {
  const { documentId, node_id } = splitId(cmiId);
  ac.documentCache.copyNode({
    mode: 'copy',
    documentId,
    node_id,
  });
};

export const cutNode = cmiId => {
  const { documentId, node_id } = splitId(cmiId);
  ac.documentCache.copyNode({
    mode: 'cut',
    documentId,
    node_id,
  });
};

export const pasteNode = cmiId => {
  const { documentId, node_id } = splitId(cmiId);
  ac.documentCache.pasteNode({
    documentId,
    new_father_id: node_id,
  });
};
