import * as React from 'react';
import { Icon, Icons } from '@cherryjuice/icons';
import { modToolbar } from '::sass-modules';
import { testIds } from '::cypress/support/helpers/test-ids';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { documentHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { Tooltip, ToolbarButton } from '@cherryjuice/components';

const mapState = (state: Store) => {
  return {
    showTree: state.editor.showTree,
    online: state.root.online,
    userHasUnsavedChanges: getDocumentsList(state).some(
      documentHasUnsavedChanges,
    ),
    documentId: state.document.documentId,
    isDocumentOwner: hasWriteAccessToDocument(state),
    showTimeline: state.timelines.showTimeline,
    documentActionNOF: state.timelines.documentActionNOF,
    showBookmarks: state.dialogs.showBookmarks,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const MainButtons: React.FC<PropsFromRedux> = ({
  showTree,
  userHasUnsavedChanges,
  documentId,
  isDocumentOwner,
  online,
  showTimeline,
  documentActionNOF,
  children,
}) => {
  const noDocumentIsSelected = !documentId;

  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton
        onClick={ac.editor.toggleTree}
        active={showTree}
        disabled={noDocumentIsSelected}
      >
        <Tooltip label={'Toggle tree'} position={'bottom-right'}>
          <Icon image={true} name={Icons.material.tree} size={20} />
        </Tooltip>
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
        <Tooltip label={'Local document changes'}>
          <Icon name={Icons.material.history} />
        </Tooltip>
      </ToolbarButton>
      <ToolbarButton
        dontMount={!isDocumentOwner}
        onClick={ac.document.save}
        testId={testIds.toolBar__main__saveDocument}
        disabled={!userHasUnsavedChanges || !online}
      >
        <Tooltip label={'Save all documents'}>
          <Icon name={Icons.material.save} />
        </Tooltip>
      </ToolbarButton>
      {children}
    </div>
  );
};
const _ = connector(MainButtons);
export { _ as MainButtons };
