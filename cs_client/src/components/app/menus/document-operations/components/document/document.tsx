import * as React from 'react';
import { modDocumentOperations } from '::sass-modules/index';
import { DS } from '::types/graphql/generated';
import { ac } from '::root/store/store';
import { useDeleteFile } from '::app/menus/select-file/hooks/delete-documents/delete-file';
import { mapEventType } from './helpers/map-event-type';
import { ActionButton } from './components/action-button';

type TDocumentProps = {
  name: string;
  id: string;
  eventType: DS;
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
    <div className={modDocumentOperations.documentOperations__document}>
      <div className={modDocumentOperations.documentOperations__document__name}>
        {cropNampe(name)}
      </div>
      <div className={modDocumentOperations.documentOperations__document__status}>
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
