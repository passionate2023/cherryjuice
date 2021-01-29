import * as React from 'react';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ac, Store } from '::store/store';
import { HNodeName } from '::root/components/app/components/editor/document/components/tree/components/node/components/node-title/components/h-node-name';
import { modNode } from '::sass-modules';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { Draggable } from '::root/components/app/components/editor/document/components/tree/components/node/_/draggable';
import { FilteredNodes } from '::store/epics/filter-tree/helpers/filter-tree/filter-tree';
import nodeMod from '::sass-modules/tree/node.scss';
import { InlineInput } from '::shared-components/inline-input/inline-input';
import { TreeContext } from '::app/components/editor/document/components/tree/tree';

type Props = {
  nodeStyle: Record<string, string>;
  name: string;
  tags: string;
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
  tags,
}) => {
  const nodesFilter = useSelector<Store, string>(
    state => state.document.nodesFilter,
  );
  const filteredNodes = useSelector<Store, FilteredNodes>(
    state => state.document.filteredNodes,
  );
  const matchesFilter = filteredNodes && filteredNodes[node_id];
  useEffect(() => {
    if (matchesFilter) ac.documentCache.expandNode({ documentId, node_id });
  }, [matchesFilter]);
  const id = documentId + '/' + node_id;
  const inlineInputProps = useContext(TreeContext);
  const onDoubleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    inlineInputProps.enableInput(id)();
  };
  useEffect(() => {
    setTimeout(() => {
      const isNewFolder = !name;
      if (isNewFolder) inlineInputProps.enableInput(id)();
    });
  }, []);
  return (
    <Droppable
      childOfAnchor={true}
      anchorId={node_id + ''}
      anchorClassName={modNode.node}
      meta={{ documentId }}
      onDrop={ac.node.drop}
      onDragEnterStyleClass={nodeMod.droppableDraggingOver}
    >
      {(provided, ref) => (
        <div
          className={modNode.node__title}
          style={{ ...nodeStyle }}
          {...provided}
          ref={ref}
        >
          {id && inlineInputProps?.currentlyEnabledInput === id ? (
            <InlineInput
              initialValue={name}
              checkValidity={inlineInputProps.checkValidity}
              onAcceptInput={inlineInputProps.disableInput(id, name)}
            />
          ) : (
            <Draggable anchorId={'' + node_id} anchorIndex={index}>
              {(provided, ref) => (
                <span {...provided} ref={ref} onDoubleClick={onDoubleClick}>
                  {matchesFilter ? (
                    <HNodeName name={name} query={nodesFilter} tags={tags} />
                  ) : (
                    name
                  )}
                </span>
              )}
            </Draggable>
          )}
        </div>
      )}
    </Droppable>
  );
};

export { NodeTitle };
