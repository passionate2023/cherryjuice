import * as React from 'react';
import { MutableRefObject, useEffect, useLayoutEffect } from 'react';
import { ac, Store } from '::store/store';
import { CssVariables } from '::store/ducks/css-variables';
import { useSelector } from 'react-redux';
import { PersistedDocumentState } from '::store/ducks/document-cache/document-cache';
import { modNode } from '::sass-modules';

type TReeRef = MutableRefObject<HTMLElement>;
const getSelectedNodeElement = (treeRef: TReeRef, node_id: number) =>
  treeRef.current?.querySelector(`[data-node-id="${node_id}"]`);

type Props = {
  treeRef: TReeRef;
};
export const Overlay = ({ treeRef }: Props) => {
  const persistedState = useSelector<Store>(
    state =>
      state.documentCache.documents[state.document.documentId]?.persistedState,
  ) as PersistedDocumentState;
  const isOnMd = useSelector<Store>(state => state.root.isOnMd);
  const selectedNodeId = persistedState?.selectedNode_id;
  const treeState = persistedState?.treeState;

  const updateOverlayPosition = () => {
    const node = selectedNodeId
      ? getSelectedNodeElement(treeRef, selectedNodeId)
      : undefined;
    ac.cssVariables.set(
      CssVariables.overlayTop,
      node ? node.getBoundingClientRect().top : 0,
    );
  };
  useEffect(updateOverlayPosition, []);
  useLayoutEffect(updateOverlayPosition, [selectedNodeId, treeState, isOnMd]);
  return <div className={modNode.node__titleOverlay} />;
};
