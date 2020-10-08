import { createSelector } from 'reselect';
import { getDocuments } from '::store/selectors/cache/document/document';
import { store } from '::store/store';
import { QFullNode } from '::store/ducks/document-cache/document-cache';

type Props = { node_id; documentId };
const _getNode = ({ node_id, documentId }: Props) =>
  createSelector(getDocuments, documentsDict => {
    if (documentId && node_id !== -1) {
      const nodes = documentsDict[documentId]?.nodes;
      if (nodes) return nodes[node_id];
    }
  });

export const getNode = (props: Props): QFullNode =>
  _getNode(props)(store.getState());
