import * as React from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { MutableRefObject, useEffect, useRef } from 'react';
import { nodeOverlay } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/node-overlay';
import { scrollIntoToolbar } from '::helpers/ui';
import { useSelector } from 'react-redux';
import { Store } from '::store/store';

type Props = {
  clickTimestamp: number;
  node_id: number;
  nodeComponentRef: MutableRefObject<HTMLDivElement>;
};

const NodeOverlay: React.FC<Props> = ({
  node_id,
  clickTimestamp,
  nodeComponentRef,
}) => {
  const selectedNode_id = useSelector<Store>(
    state =>
      state.documentCache[state.document.documentId]?.state?.selectedNode_id,
  );
  const clicks = useRef({ 0: true });
  const isSelected =
    !clicks.current[clickTimestamp] || selectedNode_id === node_id;
  useEffect(() => {
    if (isSelected) {
      nodeOverlay.updateWidth();
      nodeOverlay.updateLeft(nodeComponentRef);
      nodeComponentRef?.current?.scrollIntoView();
      scrollIntoToolbar();
    }
  }, [isSelected]);

  useEffect(() => {
    const handle = setTimeout(() => {
      clicks.current[clickTimestamp] = true;
    }, 100);
    return () => {
      clearTimeout(handle);
    };
  }, [clickTimestamp]);
  return <div className={isSelected ? nodeMod.node__titleOverlay : 0} />;
};

export { NodeOverlay };
