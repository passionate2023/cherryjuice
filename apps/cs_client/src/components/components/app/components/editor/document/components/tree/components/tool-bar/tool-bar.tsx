import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useEffect, useState } from 'react';
import { useSortMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/sort-menu-items';
import { useFoldMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/fold-menu-items';
import { Search } from '::shared-components/search-input/search';
import { NodesButtons } from './components/nodes-buttons/nodes-buttons';
import { ContextMenuWrapper } from '@cherryjuice/components';
import { testIds } from '::cypress/support/helpers/test-ids';
import { TreeToolbarButton } from '::app/components/editor/document/components/tree/components/tool-bar/components/nodes-buttons/tree-toolbar-buton/tree-toolbar-button';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);

  const selectedNode_id = document?.persistedState?.selectedNode_id;
  const node = document?.nodes && document.nodes[selectedNode_id];
  const father_id = node && node.father_id;
  return {
    father_id,
    documentId: document?.id,
    showNodePath: state.editor.showNodePath,
    selectedNode_id,
    filter: state.document.nodesFilter,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  documentId,
  showNodePath,
  selectedNode_id,
  filter,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const foldMenuItems = useFoldMenuItems({
    documentId,
    node_id: selectedNode_id,
  });
  const sortMenuItems = useSortMenuItems({
    documentId,
    node_id: selectedNode_id,
  });
  useEffect(() => {
    const parent = document.querySelector('.' + modTreeToolBar.treeToolBar);
    if (filter) {
      parent.classList.add(modTreeToolBar.treeToolBarActive);
    } else parent.classList.remove(modTreeToolBar.treeToolBarActive);
  }, [filter]);
  const [inputShown, setInputShown] = useState(false);
  return (
    <div className={modTreeToolBar.treeToolBar}>
      <div className={modTreeToolBar.treeToolBar__controls}>
        <Search
          providedValue={filter}
          onChange={ac.document.setNodesFilter}
          placeholder={'filter nodes'}
          hideableInput={'manual'}
          style={{
            elementHeight: mbOrTb ? 36 : 30,
            elementWidth: '100%',
            buttonBc: 'var(--surface-100)',
            buttonHoverBc: 'var(--primary-085)',
          }}
          onInputShown={setInputShown}
          tooltip={'filter nodes'}
        />
        {!inputShown && (
          <>
            <NodesButtons />
            <ContextMenuWrapper
              hookProps={{
                getIdOfActiveElement: () => testIds.tree__threeDots,
                getActiveElement: () =>
                  document.querySelector(
                    `[data-testid="${testIds.tree__threeDots}"]`,
                  ),
              }}
              items={[
                ...foldMenuItems,
                ...sortMenuItems,
                {
                  name: 'show node path',
                  onClick: ac.editor.toggleNodePath,
                  active: showNodePath,
                  hideOnClick: false,
                },
              ]}
              positionPreferences={{
                positionX: 'rl',
                positionY: 'tt',
                offsetX: 3,
                offsetY: 0,
              }}
            >
              {({ show }) => (
                <TreeToolbarButton
                  icon={'three-dots-vertical'}
                  onClick={show}
                  testId={testIds.tree__threeDots}
                  tooltip={'More options'}
                />
              )}
            </ContextMenuWrapper>
          </>
        )}
      </div>
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
