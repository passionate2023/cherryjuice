import * as React from 'react';
import { modImportProgress } from '::sass-modules/index';
import { DOCUMENT_SUBSCRIPTIONS } from '::types/graphql/generated';

type TDocumentProps = {
  name: string;
  id: string;
  status: DOCUMENT_SUBSCRIPTIONS;
};
const mapStatus = (value: DOCUMENT_SUBSCRIPTIONS) => {
  switch (value) {
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PENDING:
      return 'pending';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_PREPARING:
      return 'preparing';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_STARTED:
      return 'in progress';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FINISHED:
      return 'finished';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_FAILED:
      return 'failed';
    case DOCUMENT_SUBSCRIPTIONS.DOCUMENT_IMPORT_DUPLICATE:
      return 'duplicate';
  }
};
const cropNampe = (name: string) =>
  name.length < 19 ? name : `${name.substring(0, 18)}...`;
const Document: React.FC<TDocumentProps> = ({ name, status }) => {
  return (
    <div className={modImportProgress.importProgress__document}>
      <div className={modImportProgress.importProgress__document__name}>
        {cropNampe(name)}
      </div>
      <div className={modImportProgress.importProgress__document__status}>
        {mapStatus(status)}
      </div>
    </div>
  );
};

export { Document };
export { TDocumentProps };
