import * as React from 'react';
import { modDocumentOperations } from '::sass-modules/index';
import { DocumentSubscription } from '::types/graphql/generated';
import { ac } from '::root/store/store';
import { mapEventType } from './helpers/map-event-type';
import { ActionButton } from './components/action-button';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';

const mapState = (state: Store) => ({
  user: state.auth.user,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Document: React.FC<{
  document: DocumentSubscription;
} & PropsFromRedux> = ({ document, user }) => {
  const open = () => {
    ac.document.setDocumentId(document.id);
  };

  return (
    <div className={modDocumentOperations.documentOperations__document}>
      <div className={modDocumentOperations.documentOperations__document__name}>
        {document.name}
      </div>
      <div
        className={modDocumentOperations.documentOperations__document__status}
      >
        {mapEventType(document.status)}
      </div>
      <ActionButton
        {...{
          open,
          document: document,
          userId: user?.id,
        }}
      />
    </div>
  );
};

const _ = connector(Document);
export { _ as Document };
