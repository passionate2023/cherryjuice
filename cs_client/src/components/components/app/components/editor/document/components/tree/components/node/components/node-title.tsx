import * as React from 'react';
import { useEffect } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { useSelector } from 'react-redux';
import { ac, Store } from '::store/store';
import { HNodeName } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title/components/h-node-name';
import { Draggable } from '::root/components/app/components/editor/document/components/tree/components/node/_/draggable';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';

type Props = {
  nodeStyle: Record<string, string>;
  name: string;
  documentId: string;
  node_id: number;
  index: number;
};

const NodeTitle: React.FC<Props> = ({
  name,
  nodeStyle,
  documentId,
  node_id,
  index,
}) => {
  const nodesFilter = useSelector<Store, string>(
    state => state.document.nodesFilter,
  );
  const matchesFilter = nodesFilter && name.toLowerCase().includes(nodesFilter);
  useEffect(() => {
    if (matchesFilter) ac.documentCache.expandNode({ documentId, node_id });
  }, [matchesFilter]);
  return (
    <Droppable
      childOfAnchor={true}
      anchorId={node_id + ''}
      anchorClassName={nodeMod.node}
      meta={{ documentId }}
      onDrop={ac.node.drop}
    >
      {(provided, ref) => (
        <div
          className={nodeMod.node__title}
          style={{ ...nodeStyle }}
          {...provided}
          ref={ref}
        >
          <Draggable anchorId={'' + node_id} anchorIndex={index}>
            {(provided, ref) => (
              <span {...provided} ref={ref}>
                {matchesFilter ? (
                  <HNodeName name={name} query={nodesFilter} />
                ) : (
                  name
                )}
              </span>
            )}
          </Draggable>
        </div>
      )}
    </Droppable>
  );
};

export { NodeTitle };
