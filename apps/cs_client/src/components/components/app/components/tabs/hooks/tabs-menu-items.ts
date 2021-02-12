import { ac } from '::store/store';
import { useCallback } from 'react';
import {
  CachedDocumentState,
  NodesDict,
  PersistedDocumentState,
} from '::store/ducks/document-cache/document-cache';
import { CMItem } from '@cherryjuice/components';

type Props = {
  activeTab: number;
  // hide: () => void;
  documentId: string;
  nodes: NodesDict;
  localState: CachedDocumentState;
  bookmarks: PersistedDocumentState['bookmarks'];
  recentNodes: number[];
};
const useTabsMenuItems = ({
  documentId,
  activeTab,
  recentNodes,
  localState,
  // hide,
  bookmarks = [],
}: Props): CMItem[] => {
  const closeSelectedM = useCallback(() => {
    ac.node.close({ documentId, node_id: activeTab });
    // hide();
  }, [documentId, activeTab]);

  const closeAllM = useCallback(() => {
    ac.node.close({ documentId, node_ids: recentNodes });
    // hide();
  }, [documentId, recentNodes]);

  const closeUnchangedM = useCallback(() => {
    const unchanged = recentNodes.filter(
      node_id => !localState.editedNodes.edited[node_id],
    );
    ac.node.close({ documentId, node_ids: unchanged });
    // hide();
  }, [documentId, recentNodes, localState.editedNodes.edited]);

  const closeOthersM = useCallback(() => {
    const others = recentNodes.filter(_node_id => _node_id !== activeTab);
    ac.node.close({ documentId, node_ids: others, node_id: activeTab });
    // hide();
  }, [documentId, recentNodes, activeTab]);

  const closeOthersToLeftM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(activeTab);
    const others = recentNodes.filter((_, i) => i < indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    // hide();
  }, [documentId, recentNodes, activeTab]);

  const closeOthersToRightM = useCallback(() => {
    const indexOfFocusedNode = recentNodes.indexOf(activeTab);
    const others = recentNodes.filter((_, i) => i > indexOfFocusedNode);
    ac.node.close({ documentId, node_ids: others });
    // hide();
  }, [documentId, recentNodes, activeTab]);

  const renameM = useCallback(() => {
    ac.node.select({ documentId, node_id: activeTab });
    ac.dialogs.showEditNode();
    // hide();
  }, [documentId, recentNodes, activeTab]);

  const closeDocumentM = useCallback(() => {
    ac.document.setDocumentId('');
    // hide();
  }, []);

  const bookmarkM = useCallback(() => {
    !bookmarks.includes(+activeTab)
      ? ac.documentCache.addBookmark({ documentId, node_id: activeTab })
      : ac.documentCache.removeBookmark({ documentId, node_id: activeTab });
    // hide();
  }, [documentId, bookmarks, activeTab]);

  return [
    {
      name: bookmarks.includes(+activeTab) ? 'remove bookmark' : 'bookmark',
      onClick: bookmarkM,
    },
    { name: 'node properties', onClick: renameM, bottomSeparator: true },
    { name: 'close tab', onClick: closeSelectedM },
    { name: 'close all tabs', onClick: closeAllM },
    { name: 'close unchanged tabs', onClick: closeUnchangedM },
    { name: 'close other tabs', onClick: closeOthersM },
    { name: 'close tabs to the left', onClick: closeOthersToLeftM },
    {
      name: 'close tabs to the right',
      onClick: closeOthersToRightM,
      bottomSeparator: true,
    },
    { name: 'close document', onClick: closeDocumentM },
  ];
};

export { useTabsMenuItems };
