import * as React from 'react';
import { appActionCreators } from '::app/reducer';
import { ToolbarButton } from '::app/editor/tool-bar/tool-bar-button';
import { Icon, Icons, ICON_GROUP } from '::shared-components/icon';
import { modToolbar } from '::sass-modules/index';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
const mapState = (state: Store) => ({
  showTree: state.editor.showTree,
});

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  documentHasUnsavedChanges: boolean;
  selectedNodeId: string;
};

const MainButtons: React.FC<Props & PropsFromRedux> = ({
  showTree,
  selectedNodeId,
  documentHasUnsavedChanges,
}) => {
  const ctSvgAttributes = { width: '20px', height: '20px' };
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={ac.editor.toggleTree} enabled={showTree}>
        <Icon
          svg={{
            name: Icons.cherrytree.additionalIcons['cherries'],
            group: ICON_GROUP.cherrytree,
          }}
          svgAttributes={ctSvgAttributes}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaEdit}
        disabled={!selectedNodeId}
        testId={testIds.toolBar__main__editNodeMeta}
      >
        <Icon svg={{ name: Icons.material.edit }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.toggleDeleteDocumentModal}
        disabled={!selectedNodeId}
        testId={testIds.toolBar__main__deleteNode}
      >
        <Icon svg={{ name: Icons.material.delete }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateSibling}
        testId={testIds.toolBar__main__createSiblingNode}
      >
        <Icon
          svg={{
            name: Icons.cherrytree.additionalIcons['tree-node-add'],
            group: ICON_GROUP.cherrytree,
          }}
          svgAttributes={ctSvgAttributes}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={appActionCreators.showNodeMetaCreateChild}
        testId={testIds.toolBar__main__createChildNode}
      >
        <Icon
          svg={{
            name: Icons.cherrytree.additionalIcons['tree-subnode-add'],
            group: ICON_GROUP.cherrytree,
          }}
          svgAttributes={ctSvgAttributes}
        />
      </ToolbarButton>
      <ToolbarButton
        onClick={ac.document.save}
        testId={testIds.toolBar__main__saveDocument}
      >
        <Icon svg={{ name: Icons.material.save }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={
          documentHasUnsavedChanges
            ? ac.dialogs.showReloadDocument
            : ac.document.fetchNodes
        }
      >
        <Icon svg={{ name: Icons.material.refresh }} />
      </ToolbarButton>
    </div>
  );
};
const _ = connector(MainButtons);
export { _ as MainButtons };
