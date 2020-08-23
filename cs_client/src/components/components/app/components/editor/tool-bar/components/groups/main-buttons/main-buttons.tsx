import * as React from 'react';
import { ToolbarButton } from '::root/components/app/components/editor/tool-bar/components/tool-bar-button/tool-bar-button';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { modToolbar } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';
import { documentHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    showTree: state.editor.showTree,
    userHasUnsavedChanges: getDocumentsList(state).some(
      documentHasUnsavedChanges,
    ),
    documentHasUnsavedChanges: documentHasUnsavedChanges(document),
    selectedNode_id: document?.state?.selectedNode_id,
    documentId: state.document.documentId,
    isDocumentOwner: hasWriteAccessToDocument(state),
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const MainButtons: React.FC<Props & PropsFromRedux> = ({
  showTree,
  userHasUnsavedChanges,
  documentHasUnsavedChanges,
  selectedNode_id,
  documentId,
  isDocumentOwner,
}) => {
  const noDocumentIsSelected = !documentId;
  const noNodeIsSelected = !selectedNode_id;
  const newDocument = documentId?.startsWith('new');
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton
        onClick={ac.editor.toggleTree}
        active={showTree}
        disabled={noDocumentIsSelected}
      >
        <Icon name={Icons.material.tree} size={20} />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showEditNode}
        disabled={noNodeIsSelected || noDocumentIsSelected}
        testId={testIds.toolBar__main__editNodeMeta}
      >
        <Icon name={Icons.material.edit} loadAsInlineSVG={'force'} />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showDeleteNode}
        disabled={noNodeIsSelected || noDocumentIsSelected}
        testId={testIds.toolBar__main__deleteNode}
      >
        <Icon name={Icons.material.delete} loadAsInlineSVG={'force'} />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showCreateSiblingNode}
        testId={testIds.toolBar__main__createSiblingNode}
        disabled={noDocumentIsSelected}
      >
        <Icon
          name={Icons.material['create-sibling']}
          size={20}
          loadAsInlineSVG={'force'}
        />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.dialogs.showCreateChildNode}
        testId={testIds.toolBar__main__createChildNode}
        disabled={noDocumentIsSelected}
      >
        <Icon
          name={Icons.material['create-child']}
          size={20}
          loadAsInlineSVG={'force'}
        />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.document.save}
        testId={testIds.toolBar__main__saveDocument}
        disabled={!userHasUnsavedChanges}
      >
        <Icon name={Icons.material.save} loadAsInlineSVG={'force'} />
      </ToolbarButton>
      <ToolbarButton
        onClick={
          documentHasUnsavedChanges
            ? ac.dialogs.showReloadDocument
            : ac.document.fetch
        }
        disabled={noDocumentIsSelected || newDocument}
      >
        <Icon name={Icons.material.refresh} loadAsInlineSVG={'force'} />
      </ToolbarButton>
    </div>
  );
};
const _ = connector(MainButtons);
export { _ as MainButtons };