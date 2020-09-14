import * as React from 'react';
import { MutableRefObject, useEffect } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { useSelector } from 'react-redux';
import { ac, Store } from '::store/store';
import { HNodeName } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title/components/h-node-name';

type Props = {
  titleRef: MutableRefObject<HTMLDivElement>;
  nodeStyle: Record<string, string>;
  nodeDndProps: any;
  name: string;
  documentId: string;
  node_id: number;
};

const NodeTitle: React.FC<Props> = ({
  name,
  nodeStyle,
  titleRef,
  nodeDndProps,
  documentId,
  node_id,
}) => {
  const nodesFilter = useSelector<Store, string>(
    state => state.document.nodesFilter,
  );
  const matchesFilter = nodesFilter && name.toLowerCase().includes(nodesFilter);
  useEffect(() => {
    if (matchesFilter) ac.documentCache.expandNode({ documentId, node_id });
  }, [matchesFilter]);
  return (
    <div
      className={nodeMod.node__title}
      style={{ ...nodeStyle }}
      ref={titleRef}
      {...nodeDndProps}
    >
      {matchesFilter ? <HNodeName name={name} query={nodesFilter} /> : name}
    </div>
  );
};

export { NodeTitle };
