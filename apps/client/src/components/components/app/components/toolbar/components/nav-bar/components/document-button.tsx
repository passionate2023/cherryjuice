import * as React from 'react';
import { Store } from '::store/store';
import { testIds } from '@cherryjuice/test-ids';
import { ToolbarButton } from '::app/components/toolbar/components/toolbar-button/toolbar-button';
import { connect, ConnectedProps } from 'react-redux';
import { DocumentDropdownMenu } from '::app/components/menus/modals/document-dropdown-menu/document-dropdown-menu';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { Popper } from '@cherryjuice/components';

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
    <>
      {isDocumentOwner && (
        <Popper
          body={({ hide }) => (
            <DocumentDropdownMenu
              key={'DocumentDropdownMenu'}
              includeCurrentDocumentSection={includeCurrentDocumentSection}
              hide={hide}
            />
          )}
          getContext={{
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
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          {({ show, shown }) => (
            <ToolbarButton
              active={shown}
              onClick={show}
              testId={testIds.toolBar__navBar__documentButton}
              icon={'add'}
              tooltip={'Document menu'}
            />
          )}
        </Popper>
      )}
    </>
  );
};

const _ = connector(DocumentButton);
export { _ as DocumentButton };
