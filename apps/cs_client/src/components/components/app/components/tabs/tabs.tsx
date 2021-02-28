import * as React from 'react';
import { modTabs } from '::sass-modules';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { VisibleTabs } from '::app/components/tabs/components/visible-tabs';
import { useState } from 'react';
import { clampTabs } from '::app/components/tabs/helpers/clamp-tabs/clamp-tabs';
import { HiddenTabs } from '::app/components/tabs/components/hidden-tabs';
import { useTabsMenuItems } from '::app/components/tabs/hooks/tabs-menu-items';
import { createNodePropsMapper } from '::app/components/tabs/helpers/map-props';
import { useForceUpdate } from '::hooks/react/force-update';
import { ContextMenu } from '@cherryjuice/components';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const getNumberOfVisibleTabs = () => {
  const tabsList = document.querySelector('.' + modTabs.tabsList);
  const number = tabsList ? (tabsList.clientWidth - 20) / 175 : 0;
  return number;
};

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    localState: document?.localState,
    nodes: document?.nodes,
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

const Tabs: React.FC<PropsFromRedux> = ({
  nodes,
  selectedNode_id,
  recentNodes,
  documentId,
  localState,
  bookmarks,
  showHome,
}) => {
  useForceUpdate();
  const { mbOrTb } = useCurrentBreakpoint();
  let visible: number[] = [],
    hidden: number[] = [];
  if (recentNodes)
    if (mbOrTb) {
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

  const getContext = {
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
  const indexOfSelectedTab = showHome ? -1 : visible.indexOf(selectedNode_id);
  return (
    <div className={modTabs.tabsContainer}>
      <ContextMenu items={tabContextMenuOptions} getContext={getContext}>
        {({ show }) => (
          <VisibleTabs
            documentId={documentId}
            nodes={visible.map(mapNodeProps)}
            mbOrTb={mbOrTb}
            onContextMenu={show}
            indexOfSelectedTab={indexOfSelectedTab}
          >
            {!!hidden.length && (
              <HiddenTabs
                documentId={documentId}
                nodes={hidden.map(mapNodeProps)}
              />
            )}
          </VisibleTabs>
        )}
      </ContextMenu>
    </div>
  );
};

const _ = connector(Tabs);
export { _ as Tabs };
