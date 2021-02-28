import * as React from 'react';
import { ToolbarButton, DropDownButton } from '@cherryjuice/components';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';

const mapState = (state: Store) => {
  return {
    selectedNode_id: getCurrentDocument(state)?.persistedState?.selectedNode_id,
    documentId: state.document.documentId,
  };
};
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = Record<string, never>;

const Buttons: React.FC<Props & PropsFromRedux> = ({
  selectedNode_id,
  documentId,
}) => {
  const disabled = !documentId || !selectedNode_id;
  return (
    <>
      <DropDownButton
        collapseOnInsideClick={true}
        buttons={[
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showAnchorDialog}
                disabled={disabled}
                tooltip={'Insert an anchor'}
                icon={'anchor'}
              />
            ),
            key: 'anchor',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showLinkDialog}
                disabled={disabled}
                tooltip={'Insert a link'}
                icon={'link'}
              />
            ),
            key: 'link',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showCodeboxDialog}
                disabled={disabled}
                tooltip={'Insert a codebox'}
                icon={'code'}
              />
            ),
            key: 'codebox',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showTableDialog}
                disabled={disabled}
                tooltip={'Insert a table'}
                icon={'table'}
              />
            ),
            key: 'table',
          },
        ]}
      />
    </>
  );
};
const Objects = connector(Buttons);
export { Objects };
