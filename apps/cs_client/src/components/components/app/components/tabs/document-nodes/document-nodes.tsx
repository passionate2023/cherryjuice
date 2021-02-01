import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tabs } from '::app/components/tabs/document-nodes/components/tabs';
import { useState } from 'react';
import { clampTabs } from '::app/components/tabs/document-nodes/helpers/clamp-tabs/clamp-tabs';
import { HiddenTabs } from '::app/components/tabs/document-nodes/components/hidden-tabs';
import { useTabsMenuItems } from '::app/components/tabs/document-nodes/hooks/tabs-menu-items';
import { createNodePropsMapper } from '::app/components/tabs/document-nodes/helpers/map-props';
import { useForceUpdate } from '::hooks/react/force-update';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';

const getNumberOfVisibleTabs = () => {
  const tabsList = document.querySelector('.' + modTabs.tabsList);
  const number = tabsList ? tabsList.clientWidth / 175 : 0;
  return number;
};

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    localState: document?.localState,
    nodes: document?.nodes,
    isOnMd: state.root.isOnMd,
    vw: state.cssVariables.vw,
    selectedNode_id: document?.persistedState?.selectedNode_id,
    recentNodes: document?.persistedState?.recentNodes,
    bookmarks: document?.persistedState?.bookmarks,
    documentId: document?.id,
    showHome: state.home.show,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const DocumentNodes: React.FC<Props & PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  recentNodes,
  documentId,
  isOnMd,
  localState,
  bookmarks,
  showHome,
}) => {
  useForceUpdate();

  let visible: number[], hidden: number[];
  if (isOnMd) {
    visible = recentNodes;
    hidden = [];
  } else {
    const numberOfVisibleTabs = Math.floor(getNumberOfVisibleTabs());
    [visible, hidden] = clampTabs(
      recentNodes,
      selectedNode_id,
      numberOfVisibleTabs,
    );
  }

  const [activeTab, setActiveTab] = useState<number>();

  const hookProps = {
    onSelectElement: id => setActiveTab(+id),
    getIdOfActiveElement: target =>
      target.dataset.id || target.parentElement.dataset.id,
  };
  const tabContextMenuOptions = useTabsMenuItems({
    documentId,
    activeTab,
    recentNodes,
    nodes,
    localState,
    bookmarks,
  });

  const mapNodeProps = createNodePropsMapper(
    nodes,
    localState,
    selectedNode_id,
    new Set(bookmarks),
    showHome,
  );
  return (
    <div className={modTabs.tabsContainer}>
      <ContextMenuWrapper items={tabContextMenuOptions} hookProps={hookProps}>
        {({ ref, show }) => (
          <Tabs
            documentId={documentId}
            nodes={visible.map(mapNodeProps)}
            ref={ref}
            isOnMd={isOnMd}
            onContextMenu={show}
          />
        )}
      </ContextMenuWrapper>

      {!!hidden.length && (
        <HiddenTabs documentId={documentId} nodes={hidden.map(mapNodeProps)} />
      )}
    </div>
  );
};

const _ = connector(DocumentNodes);
export { _ as DocumentNodes };
