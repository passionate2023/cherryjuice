import * as React from 'react';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { memo } from 'react';
import { modToolbar } from '::app/components/toolbar/toolbar';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showFormattingButtons: state.editor.showFormattingButtons,
  contentEditable: state.editor.contentEditable,
  showInfoBar: state.editor.showInfoBar,
  isOnMb: state.root.isOnMb,
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const MobileButtons: React.FC<PropsFromRedux> = ({
  showFormattingButtons,
  showInfoBar,
  documentId,
  isDocumentOwner,
}) => {
  const noDocumentIsSelected = !documentId;
  return (
    <div className={modToolbar.toolbar__group}>
      {isDocumentOwner && (
        <ToolbarButton
          onClick={ac.editor.toggleFormattingBar}
          active={showFormattingButtons}
          tooltip={`${
            showFormattingButtons ? 'hide' : 'show'
          } formatting buttons`}
          icon={'justify-left'}
        />
      )}
      <ToolbarButton
        onClick={ac.editor.toggleInfoBar}
        active={showInfoBar}
        tooltip={`${showFormattingButtons ? 'hide' : 'show'} information bar`}
        icon={'info'}
        disabled={noDocumentIsSelected}
      />
    </div>
  );
};

const _ = connector(MobileButtons);
const M = memo(_);
export { M as MobileButtons };
