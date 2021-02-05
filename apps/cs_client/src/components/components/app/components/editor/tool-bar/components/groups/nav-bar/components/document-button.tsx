import * as React from 'react';
import { Store } from '::store/store';
import { testIds } from '::cypress/support/helpers/test-ids';
import { Icon, Icons } from '@cherryjuice/icons';
import { ToolbarButton, Tooltip } from '@cherryjuice/components';
import { connect, ConnectedProps } from 'react-redux';
import { DocumentDropdownMenu } from '::app/components/menus/modals/document-dropdown-menu/document-dropdown-menu';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';

const mapState = (state: Store) => ({
  isDocumentOwner: hasWriteAccessToDocument(state),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  includeCurrentDocumentSection?: boolean;
};

const DocumentButton: React.FC<Props & PropsFromRedux> = ({
  isDocumentOwner,
  includeCurrentDocumentSection,
}) => {
  return (
    <ContextMenuWrapper
      customBody={({ hide }) => (
        <DocumentDropdownMenu
          key={'DocumentDropdownMenu'}
          includeCurrentDocumentSection={includeCurrentDocumentSection}
          hide={hide}
        />
      )}
      hookProps={{
        getIdOfActiveElement: () => 'DocumentDropdownMenu',
        getActiveElement: () =>
          document.querySelector(
            `[data-testid="${testIds.toolBar__navBar__documentButton}"]`,
          ),
      }}
      positionPreferences={{
        positionX: 'rr',
        positionY: 'bt',
        offsetX: 0,
        offsetY: 3,
      }}
    >
      {({ ref, show, shown }) => (
        <ToolbarButton
          dontMount={!isDocumentOwner}
          active={shown}
          onClick={show}
          testId={testIds.toolBar__navBar__documentButton}
          _ref={ref}
        >
          <Tooltip label={'Document menu'}>
            <Icon name={Icons.material.add} />
          </Tooltip>
        </ToolbarButton>
      )}
    </ContextMenuWrapper>
  );
};

const _ = connector(DocumentButton);
export { _ as DocumentButton };
