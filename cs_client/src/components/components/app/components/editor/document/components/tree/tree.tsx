import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Node } from './components/node/node';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { useDnDNodes } from '::root/components/app/components/editor/document/components/tree/components/node/hooks/dnd-nodes';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { NodePrivacy } from '::types/graphql/generated';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';

const getParamsFromLocation = () => {
  const params = { expand: undefined };
  const expand = /expand=(\d+)/.exec(location.search);
  if (expand) {
    params.expand = expand[1];
  }
  return params;
};

type Props = {};

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  const nodes = document.nodes;
  return {
    filteredNodes: state.document.filteredNodes,
    nodes: nodes,
    documentPrivacy: document.privacy,
    treeState: document.state.treeState,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Tree: React.FC<Props & PropsFromRedux> = ({
  nodes,
  documentPrivacy,
  treeState,
  filteredNodes,
}) => {
  useEffect(onStart, []);
  const componentRef = useRef();
  const rootTreeDndProps = useDnDNodes({
    componentRef,
    nodes,
    node_id: 0,
    draggable: false,
  });

  const params = getParamsFromLocation();

  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={treeModule.tree__resizeHandle}
    >
      <ErrorBoundary>
        <div className={treeModule.tree}>
          <ToolBar />
          <ul
            className={treeModule.tree_rootList}
            {...rootTreeDndProps}
            ref={componentRef}
          >
            {nodes &&
              nodes[0].child_nodes.map(node_id => {
                const node = nodes[node_id];
                if (!filteredNodes || filteredNodes[node_id])
                  return (
                    <Node
                      fatherState={treeState[0]}
                      key={node.node_id}
                      node_id={node.node_id}
                      nodes={nodes}
                      depth={0}
                      node_title_styles={node.node_title_styles}
                      documentPrivacy={documentPrivacy}
                      parentPrivacy={NodePrivacy.DEFAULT}
                      expand={params.expand}
                      filteredNodes={filteredNodes}
                    />
                  );
              })}
          </ul>
        </div>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
