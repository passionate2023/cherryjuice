import * as React from 'react';
import { ToolbarButton } from '@cherryjuice/components';
import { modToolbar } from '::sass-modules';
import { Icon, Icons } from '@cherryjuice/icons';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { Tooltip } from '@cherryjuice/components';
import { DropDownButton } from '::shared-components/drop-down-button/drop-down-button';

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
                className={modToolbar.toolBar__iconStrictWidth}
                disabled={disabled}
              >
                <Tooltip label={'Insert an anchor'}>
                  <Icon name={Icons.material.anchor} />
                </Tooltip>
              </ToolbarButton>
            ),
            key: 'anchor',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showLinkDialog}
                className={modToolbar.toolBar__iconStrictWidth}
                disabled={disabled}
              >
                <Tooltip label={'Insert a link'}>
                  <Icon name={Icons.material.link} />
                </Tooltip>
              </ToolbarButton>
            ),
            key: 'link',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showCodeboxDialog}
                className={modToolbar.toolBar__iconStrictWidth}
                disabled={disabled}
              >
                <Tooltip label={'Insert a code box'}>
                  <Icon name={Icons.material.code} />
                </Tooltip>
              </ToolbarButton>
            ),
            key: 'codebox',
          },
          {
            element: (
              <ToolbarButton
                onClick={ac.dialogs.showTableDialog}
                className={modToolbar.toolBar__iconStrictWidth}
                disabled={disabled}
              >
                <Tooltip label={'Insert a table'}>
                  <Icon name={Icons.material.table} />
                </Tooltip>
              </ToolbarButton>
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
