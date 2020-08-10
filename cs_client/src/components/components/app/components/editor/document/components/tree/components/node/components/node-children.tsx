import * as React from 'react';
import { MutableRefObject, useMemo } from 'react';
import nodeMod from '::sass-modules/tree/node.scss';
import { lowestPrivacy } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { NodePrivacy } from '::types/graphql/generated';
import { NodeProps } from '::root/components/app/components/editor/document/components/tree/components/node/node';
import { Node } from '../node';

type Props = Pick<
  NodeProps,
  'nodes' | 'depth' | 'documentPrivacy' | 'parentPrivacy'
> & {
  listRef: MutableRefObject<HTMLUListElement>;
  listDndProps: Record<string, any>;
  nodeDndProps: Record<string, any>;
  child_nodes: number[];
  privacy: NodePrivacy;
  expand?: number;
};

const NodeChildren: React.FC<Props> = ({
  listRef,
  listDndProps,
  nodeDndProps,
  child_nodes,
  privacy,
  nodes,
  depth,
  documentPrivacy,
  parentPrivacy,
  expand,
}) => {
  const lowestPrivacyInChain = useMemo(() => {
    const b =
      !privacy || privacy === NodePrivacy.DEFAULT ? documentPrivacy : privacy;
    return lowestPrivacy(parentPrivacy, b);
  }, [parentPrivacy, privacy, documentPrivacy]);
  return (
    <ul
      className={nodeMod.node__list}
      {...{
        ...nodeDndProps,
        onDrop: listDndProps.onDrop,
        draggable: listDndProps.draggable,
        onDragStart: listDndProps.onDragStart,
      }}
      ref={listRef}
    >
      {child_nodes.map(node_id => {
        const node = nodes.get(node_id);
        return (
          <Node
            key={node.node_id}
            node_id={node.node_id}
            nodes={nodes}
            depth={depth + 1}
            node_title_styles={node.node_title_styles}
            documentPrivacy={documentPrivacy}
            parentPrivacy={lowestPrivacyInChain}
            expand={expand}
          />
        );
      })}
    </ul>
  );
};

export { NodeChildren };
