import * as React from 'react';
import { modContextMenu } from '::sass-modules';

import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { useCallback } from 'react';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  const currentDocument = getCurrentDocument(state);
  return {
    documentId: currentDocument?.id,
    nodes: currentDocument?.nodes || {},
    localState: currentDocument?.localState,
    recentNodes: currentDocument?.persistedState?.recentNodes,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = { focusedNode_id: number; hide: () => void } & PropsFromRedux;
const TabContextMenu: React.FC<Props> = ({
  documentId,
  focusedNode_id,
  recentNodes,
  localState,
  hide,
}) => {
  const closeSelectedM = useCallback(() => {
    ac.node.close({ documentId, node_id: focusedNode_id });
    hide();
  }, [documentId, focusedNode_id]);

  const closeAllM = useCallback(() => {
    ac.node.close({ documentId, node_ids: recentNodes });
    hide();
  }, [documentId, recentNodes]);

  const closeUnchangedM = useCallback(() => {
    const unchanged = recentNodes.filter(
      node_id => !localState.editedNodes.edited[node_id],
    );
    ac.node.close({ documentId, node_ids: unchanged });
    hide();
  }, [documentId, recentNodes, localState.editedNodes.edited]);

  const closeOthersM = useCallback(() => {
    const others = recentNodes.filter(_node_id => _node_id !== focusedNode_id);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const closeOthersToLeftM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(focusedNode_id);
    const others = recentNodes.filter((_, i) => i < indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const closeOthersToRightM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(focusedNode_id);
    const others = recentNodes.filter((_, i) => i > indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const renameM = useCallback(() => {
    ac.node.select({ documentId, node_id: focusedNode_id });
    ac.dialogs.showEditNode();
    hide();
  }, [documentId, recentNodes, focusedNode_id]);

  const options: [string, () => void][] = [
    ['rename', renameM],
    ['close', closeSelectedM],
    ['close all', closeAllM],
    ['close unchanged', closeUnchangedM],
    ['close others', closeOthersM],
    ['close others to the left', closeOthersToLeftM],
    ['close others to the right', closeOthersToRightM],
  ];

  return (
    <div className={modContextMenu.listContextMenu}>
      {options.map(([name, onClick]) => (
        <div
          className={modContextMenu.listContextMenu__option}
          onClick={onClick}
          key={name}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

const _ = connector(TabContextMenu);
export { _ as TabContextMenu };
