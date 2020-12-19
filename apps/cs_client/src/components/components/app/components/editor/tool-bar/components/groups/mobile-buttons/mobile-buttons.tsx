import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { ToolbarButton } from '../../tool-bar-button/tool-bar-button';
import { Icon, Icons } from '@cherryjuice/icons';
import { Separator } from '::root/components/app/components/editor/tool-bar/components/separator';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Tooltip } from '::root/components/shared-components/tooltip/tooltip';

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

type Props = {};

const MobileButtons: React.FC<Props & PropsFromRedux> = ({
  showFormattingButtons,
  showInfoBar,
  documentId,
  isDocumentOwner,
  isOnMb,
}) => {
  const noDocumentIsSelected = !documentId;
  return (
    <>
      <div style={{ marginLeft: 'auto' }} />
      {isDocumentOwner && isOnMb && <Separator />}
      <div
        className={[
          modToolbar.toolBar__group,
          modToolbar.toolBar__groupMobileButtons,
        ].join(' ')}
      >
        <ToolbarButton
          dontMount={!isDocumentOwner}
          onClick={ac.editor.toggleFormattingBar}
          active={showFormattingButtons}
        >
          <Tooltip
            label={`${
              showFormattingButtons ? 'hide' : 'show'
            } formatting buttons`}
          >
            <Icon name={Icons.material['justify-left']} />
          </Tooltip>
        </ToolbarButton>
        <ToolbarButton
          onClick={ac.editor.toggleInfoBar}
          active={showInfoBar}
          disabled={noDocumentIsSelected}
        >
          <Tooltip
            label={`${showFormattingButtons ? 'hide' : 'show'} information bar`}
          >
            <Icon name={Icons.material.info} />
          </Tooltip>
        </ToolbarButton>
      </div>
    </>
  );
};

const _ = connector(MobileButtons);
export { _ as MobileButtons };
