import * as React from 'react';
import { useEffect } from 'react';
import { Node } from './components/node/node';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Resizable } from 're-resizable';
import { onResize, onResizeStop, onStart } from './helpers';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { ToolBar } from './components/tool-bar/tool-bar';
import { Droppable } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { modNode, modTree } from '::sass-modules';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { useChildContextMenu } from '::root/components/shared-components/context-menu/hooks/child-context-menu';

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
  const { position, show, hide, shown } = useChildContextMenu({
    getIdOfActiveElement: () => '1',
  });
  return (
    <Resizable
      enable={{ right: true }}
      onResize={onResize}
      onResizeStop={onResizeStop}
      className={modTree.tree__resizeHandle}
    >
      <ErrorBoundary>
        <div className={modTree.tree}>
          <ToolBar />
          <ContextMenuWrapper
            shown={shown}
            hide={hide}
            items={[]}
            position={position}
          >
            <Droppable
              anchorId={'0'}
              anchorClassName={modNode.node}
              meta={{ documentId }}
              onDrop={ac.node.drop}
            >
              {(provided, ref) => (
                <ul
                  className={modTree.tree_rootList}
                  {...provided}
                  ref={ref}
                  onContextMenu={show}
                >
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
          </ContextMenuWrapper>
        </div>
      </ErrorBoundary>
    </Resizable>
  );
};
const _ = connector(Tree);
export { _ as Tree };
