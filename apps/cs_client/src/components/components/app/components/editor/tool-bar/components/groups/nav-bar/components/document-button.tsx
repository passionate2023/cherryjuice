import * as React from 'react';
import { ac, Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { Icon, Icons } from '@cherryjuice/icons';
import { ToolbarButton, Tooltip } from '@cherryjuice/components';
import { connect, ConnectedProps } from 'react-redux';
import { DocumentDropdownMenu } from '::app/components/menus/modals/document-dropdown-menu/document-dropdown-menu';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';

const mapState = (state: Store) => ({
  isDocumentOwner: hasWriteAccessToDocument(state),
  showDocumentDropdownMenu: state.dialogs.showDocumentDropdownMenu,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  includeCurrentDocumentSection?: boolean;
};

const DocumentButton: React.FC<Props & PropsFromRedux> = ({
  showDocumentDropdownMenu,
  isDocumentOwner,
  includeCurrentDocumentSection,
}) => {
  return (
    <ToolbarButton
      dontMount={!isDocumentOwner}
      onClick={ac.dialogs.showDocumentDropdownMenu}
      active={showDocumentDropdownMenu}
      testId={testIds.toolBar__navBar__documentButton}
    >
      <Tooltip label={'Document menu'}>
        <Icon name={Icons.material.add} />
      </Tooltip>
      <DocumentDropdownMenu
        key={'DocumentDropdownMenu'}
        includeCurrentDocumentSection={includeCurrentDocumentSection}
      />
    </ToolbarButton>
  );
};

const _ = connector(DocumentButton);
export { _ as DocumentButton };
