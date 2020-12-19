import * as React from 'react';
import { modTreeToolBar } from '::sass-modules';
import { Icons } from '@cherryjuice/icons';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { useState } from 'react';
import { FilterNodes } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/components/filter-nodes';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { useSortMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/sort-menu-items';
import { useFoldMenuItems } from '::root/components/app/components/editor/document/components/tree/components/tool-bar/hooks/fold-menu-items';

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
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const ToolBar: React.FC<Props & PropsFromRedux> = ({
  documentId,
  showNodePath,
  selectedNode_id,
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

  return (
    <div className={modTreeToolBar.treeToolBar}>
      <div className={modTreeToolBar.treeToolBar__controls}>
        <FilterNodes />
        <ContextMenuWrapper
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
            className={modTreeToolBar.tree_focusButton}
          />
        </ContextMenuWrapper>
      </div>
    </div>
  );
};

const _ = connector(ToolBar);
export { _ as ToolBar };
