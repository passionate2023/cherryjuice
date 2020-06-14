import { useMutation } from '@apollo/react-hooks';
import { DOCUMENT_MUTATION } from '::graphql/mutations';
import { useCallback, useEffect } from 'react';
import { AlertType } from '::types/react';
import { ac } from '::root/store/store';

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
  ] = useMutation(
    DOCUMENT_MUTATION.deleteDocument,
    onCompleted && {
      onCompleted,
    },
  );
  const deleteDocument = useCallback(() => {
    deleteDocumentMutation({
      variables: { documents: { IDs } },
    });
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
