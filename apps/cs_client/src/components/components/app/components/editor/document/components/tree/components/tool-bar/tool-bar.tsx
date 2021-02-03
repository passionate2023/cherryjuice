import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { Icons } from '@cherryjuice/icons';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useEffect, useState } from 'react';
import { ButtonSquare } from '@cherryjuice/components';
import { ContextMenuWrapperLegacy } from '::shared-components/context-menu/context-menu-wrapper-legacy';
import { useSortMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/sort-menu-items';
import { useFoldMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/fold-menu-items';
import { Search } from '::shared-components/search-input/search';
import { NodesButtons } from './components/nodes-buttons/nodes-buttons';

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
    tb: state.root.isOnTb,
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
  tb,
  filter,
}) => {
  const [CMShown, setCMShown] = useState(false);
  const hide = () => setCMShown(false);
  const show = () => setCMShown(true);

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
          style={{ height: tb ? 36 : 30, width: '100%' }}
          onInputShown={setInputShown}
        />
        {!inputShown && (
          <>
            <NodesButtons />
            <ContextMenuWrapperLegacy
              shown={CMShown}
              hide={hide}
              show={show}
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
            >
              <ButtonSquare
                iconName={Icons.material['three-dots-vertical']}
                className={modTreeToolBar.button}
              />
            </ContextMenuWrapperLegacy>
          </>
        )}
      </div>
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
