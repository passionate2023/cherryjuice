import treeModule from '::sass-modules/tree/tree.scss';
import * as React from 'react';
import { useEffect } from 'react';
import { Node } from './components/node/node';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NodePrivacy } from '::types/graphql';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import nodeMod from '::sass-modules/tree/node.scss';

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
  return {
    nodes: document?.nodes,
    documentPrivacy: document?.privacy,
    treeState: document?.persistedState?.treeState,
    filteredNodes: state.document.filteredNodes,
    documentId: state.document.documentId,
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
  documentId,
}) => {
  useEffect(onStart, []);

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
          <Droppable
            anchorId={'0'}
            anchorClassName={nodeMod.node}
            meta={{ documentId }}
            onDrop={ac.node.drop}
          >
            {(provided, ref) => (
              <ul className={treeModule.tree_rootList} {...provided} ref={ref}>
                {nodes &&
                  nodes[0].child_nodes.map((node_id, index) => {
                    const node = nodes[node_id];
                    if (!filteredNodes || filteredNodes[node_id])
                      return (
                        <Node
                          index={index}
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
            )}
          </Droppable>
        </div>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
