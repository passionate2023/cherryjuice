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
    online: state.root.online,
    userHasUnsavedChanges: getDocumentsList(state).some(
      documentHasUnsavedChanges,
    ),
    documentHasUnsavedChanges: documentHasUnsavedChanges(document),
    documentId: state.document.documentId,
    isDocumentOwner: hasWriteAccessToDocument(state),
    showTimeline: state.timelines.showTimeline,
    documentActionNOF: state.timelines.documentActionNOF,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const MainButtons: React.FC<Props & PropsFromRedux> = ({
  showTree,
  userHasUnsavedChanges,
  documentHasUnsavedChanges,
  documentId,
  isDocumentOwner,
  online,
  showTimeline,
  documentActionNOF,
}) => {
  const noDocumentIsSelected = !documentId;
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
        onClick={
          documentHasUnsavedChanges
            ? ac.dialogs.showReloadDocument
            : ac.document.fetch
        }
        disabled={noDocumentIsSelected || newDocument || !online}
      >
        <Icon name={Icons.material.refresh} loadAsInlineSVG={'force'} />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.timelines.toggleTimeline}
        active={showTimeline}
        disabled={
          noDocumentIsSelected ||
          !(documentActionNOF.redo || documentActionNOF.undo)
        }
      >
        <Icon name={Icons.material.history} />
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.document.save}
        testId={testIds.toolBar__main__saveDocument}
        disabled={!userHasUnsavedChanges || !online}
      >
        <Icon name={Icons.material.save} loadAsInlineSVG={'force'} />
      </ToolbarButton>
    </div>
  );
};
const _ = connector(MainButtons);
export { _ as MainButtons };
