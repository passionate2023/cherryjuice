import * as React from 'react';
import { useMemo } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { lowestPrivacy } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { NodeProps } from '::root/components/app/components/editor/document/components/tree/components/node/node';
import { Node } from '../node';
import { NodeState } from '::store/ducks/cache/document-cache/helpers/node/expand-node/helpers/tree/tree';
import { FilteredNodes } from '::store/epics/filter-tree/helpers/filter-tree/filter-tree';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { ac } from '::store/store';

type Props = Pick<
  NodeProps,
  'nodes' | 'depth' | 'documentPrivacy' | 'parentPrivacy'
> & {
  child_nodes: number[];
  privacy: NodePrivacy;
  expand?: number;
  fatherState: NodeState;
  filteredNodes: FilteredNodes;
  node_id: number;
  documentId: string;
};

const NodeChildren: React.FC<Props> = ({
  child_nodes,
  privacy,
  nodes,
  depth,
  node_id,
  documentPrivacy,
  parentPrivacy,
  expand,
  fatherState,
  filteredNodes,
  documentId,
}) => {
  const lowestPrivacyInChain = useMemo(() => {
    const b =
      !privacy || privacy === NodePrivacy.DEFAULT ? documentPrivacy : privacy;
    return lowestPrivacy(parentPrivacy, b);
  }, [parentPrivacy, privacy, documentPrivacy]);
  return (
    <Droppable
      anchorId={'' + node_id}
      nextSiblingOfAnchor={true}
      anchorClassName={nodeMod.node}
      onDrop={ac.node.drop}
      meta={{ documentId }}
    >
      {(provided, ref) => (
        <ul className={nodeMod.node__list} ref={ref} {...provided}>
          {child_nodes.map((node_id, index) => {
            const node = nodes[node_id];
            if (!filteredNodes || filteredNodes[node_id])
              return (
                <Node
                  index={index}
                  key={node.node_id}
                  node_id={node.node_id}
                  nodes={nodes}
                  depth={depth + 1}
                  node_title_styles={node.node_title_styles}
                  documentPrivacy={documentPrivacy}
                  parentPrivacy={lowestPrivacyInChain}
                  expand={expand}
                  fatherState={fatherState}
                  filteredNodes={filteredNodes}
                />
              );
          })}
        </ul>
      )}
    </Droppable>
  );
};

export { NodeChildren };
