import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Store } from '::store/store';
import { modNode } from '::sass-modules';

type Props = {
  clickTimestamp: number;
  node_id: number;
};

const NodeOverlay: React.FC<Props> = ({ node_id, clickTimestamp }) => {
  const selectedNode_id = useSelector<Store>(
    state =>
      state.documentCache.documents[state.document.documentId]?.persistedState
        ?.selectedNode_id,
  );
  const clicks = useRef({ 0: true });
  const isSelected =
    !clicks.current[clickTimestamp] || selectedNode_id === node_id;

  useEffect(() => {
    const handle = setTimeout(() => {
      clicks.current[clickTimestamp] = true;
    }, 100);
    return () => {
      clearTimeout(handle);
    };
  }, [clickTimestamp]);
  return <div className={isSelected ? modNode.node__titleOverlay : ''} />;
};

export { NodeOverlay };
