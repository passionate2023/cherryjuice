import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { useCallback, useEffect } from 'react';
import { AlertType } from '::types/react';
import { ac } from '::root/store/store';
import { deleteLocalDocuments } from './helpers/delete-local-documents';

const useDeleteFile = ({
  IDs,
  onCompleted,
}: {
  IDs: string[];
  onCompleted?: (data: any) => void;
}) => {
  const [
    deleteDocumentMutation,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DOCUMENT_MUTATION.deleteDocument);
  const deleteDocument = useCallback(() => {
    const fetchedDocuments = IDs.filter(id => !id.startsWith('new-document'));
    const promises: Promise<any>[] = [];
    promises.push(
      fetchedDocuments.length
        ? deleteDocumentMutation({
            variables: { documents: { IDs: fetchedDocuments } },
          })
        : Promise.resolve(),
    );
    promises.push(
      new Promise(res => {
        deleteLocalDocuments({ IDs });
        res();
      }),
    );
    Promise.all(promises).then(onCompleted);
  }, [IDs]);
  useEffect(() => {
    if (deleteError)
      ac.dialogs.setAlert({
        title: `Could not delete document`,
        description: 'Please refresh the page',
        type: AlertType.Error,
        error: deleteError,
      });
  }, [deleteError]);
  return { deleteDocument, deleteLoading, deleteError };
};

export { useDeleteFile };
