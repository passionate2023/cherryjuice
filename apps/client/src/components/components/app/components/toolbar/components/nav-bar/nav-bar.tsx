import * as React from 'react';
import { DocumentSearch } from '::app/components/toolbar/components/nav-bar/components/document-search';
import { UserButton } from '::app/components/toolbar/components/nav-bar/components/user-button';
import { DocumentButton } from '::app/components/toolbar/components/nav-bar/components/document-button';
import { ac, Store } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';
import { getDocumentsList } from '::store/selectors/cache/document/document';
import { documentHasUnsavedChanges } from '::app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { connect, ConnectedProps } from 'react-redux';
import { modToolbar } from '::app/components/toolbar/toolbar';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';
import { useCurrentBreakpoint } from '@cherryjuice/shared-helpers';

const mapState = (state: Store) => {
  return {
    online: state.root.online,
    userHasUnsavedChanges: getDocumentsList(state).some(
      documentHasUnsavedChanges,
    ),
    documentId: state.document.documentId,
    isDocumentOwner: hasWriteAccessToDocument(state),
    showTimeline: state.timelines.showTimeline,
    documentActionNOF: state.timelines.documentActionNOF,
    showBookmarks: state.dialogs.showBookmarks,
    showHome: state.home.show,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

const NavBar: React.FC<PropsFromRedux> = ({
  userHasUnsavedChanges,
  documentId,
  isDocumentOwner,
  online,
  showTimeline,
  documentActionNOF,
  showHome,
}) => {
  const { mbOrTb } = useCurrentBreakpoint();
  const noDocumentIsSelected = !documentId;
  const size = mbOrTb ? 40 : 34;
  return (
    <>
      <div style={{ marginLeft: 'auto' }} />
      <div className={modToolbar.toolbar__group}>
        <DocumentSearch
          style={{
            buttonBc: 'transparent',
            buttonHoverBc: 'var(--background-100)',
            elementWidth: size,
            elementHeight: size,
          }}
        />
        {isDocumentOwner && (
          <>
            <ToolbarButton
              onClick={ac.timelines.toggleTimeline}
              active={showTimeline}
              disabled={
                noDocumentIsSelected ||
                !(documentActionNOF.redo || documentActionNOF.undo)
              }
              icon={'history'}
              tooltip={'Local document changes'}
            />
            <ToolbarButton
              onClick={ac.document.save}
              testId={testIds.toolBar__main__saveDocument}
              disabled={!userHasUnsavedChanges || !online}
              icon={'save'}
              tooltip={'Save all documents'}
            />
          </>
        )}
        <DocumentButton includeCurrentDocumentSection={!showHome} />
        <UserButton />
      </div>
    </>
  );
};

const _ = connector(NavBar);
export { _ as NavBar };
