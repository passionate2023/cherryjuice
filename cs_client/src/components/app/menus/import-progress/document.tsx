import * as React from 'react';
import { modImportProgress } from '::sass-modules/index';
import { DOCUMENT_SUBSCRIPTIONS } from '::types/graphql/generated';
import { ButtonCircle } from '::shared-components/buttons/button-circle/button-circle';
import { Icon, Icons } from '::shared-components/icon';
import { useDeleteFile } from '::hooks/graphql/delete-file';
import { ac } from '::root/store/actions.types';

type TDocumentProps = {
  name: string;
  id: string;
  eventType: DOCUMENT_SUBSCRIPTIONS;
};
const mapEventType = (value: DOCUMENT_SUBSCRIPTIONS) => {
  switch (value) {
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PENDING:
      return 'pending';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING:
      return 'uploading';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED:
      return 'importing';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED:
      return 'finished';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED:
      return 'failed';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE:
      return 'duplicate';
  }
};
const ActionButton = ({ eventType, deleteDocument, clear, open }) => {
  const status = {
    finished: eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED,
    duplicate: eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE,
    failed: eventType === DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED,
    onGoing: [
      DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PENDING,
      DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING,
      DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED,
    ].includes(eventType),
  };
  const props = { onClick: undefined, iconName: '' };
  if (status.onGoing || status.failed) {
    props.onClick = deleteDocument;
    props.iconName = status.onGoing
      ? Icons.material.stop
      : Icons.material.delete;
  } else if (status.finished) {
    props.iconName = Icons.material.document;
    props.onClick = open;
  } else if (status.duplicate) {
    props.iconName = Icons.material.clear;
    props.onClick = clear;
  }
  return !props.onClick ? (
    <></>
  ) : (
    <ButtonCircle
      key={props.iconName}
      className={modImportProgress.importProgress__document__button}
      onClick={props.onClick}
    >
      <Icon name={props.iconName} />
    </ButtonCircle>
  );
};
const cropNampe = (name: string) =>
  name.length < 19 ? name : `${name.substring(0, 18)}...`;
const Document: React.FC<TDocumentProps & {
  clearFinishedDocuments: Function;
}> = ({ name, eventType, id, clearFinishedDocuments }) => {
  const { deleteDocument } = useDeleteFile({ IDs: [id] });
  const open = () => {
    ac.document.setDocumentId(id);
  };

  return (
    <div className={modImportProgress.importProgress__document}>
      <div className={modImportProgress.importProgress__document__name}>
        {cropNampe(name)}
      </div>
      <div className={modImportProgress.importProgress__document__status}>
        {mapEventType(eventType)}
      </div>
      <ActionButton
        {...{ open, deleteDocument, clear: clearFinishedDocuments, eventType }}
      />
    </div>
  );
};

export { Document };
export { TDocumentProps };
