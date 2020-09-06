import { useEffect } from 'react';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';

type Props = {
  userHasUnsavedChanges: boolean;
  documentName?: string;
  userId?: string;
};

const useTrackDocumentChanges = ({
  userHasUnsavedChanges,
  documentName,
  userId,
}: Props) => {
  useEffect(() => {
    const prefix = userId && documentName ? `${documentName} - ` : '';
    const title = `${prefix}CherryJuice`;
    if (userHasUnsavedChanges) {
      document.title = '*' + title;
      onBeforeUnload.attach();
    } else {
      onBeforeUnload.remove();
      document.title = title;
    }
  }, [userHasUnsavedChanges, documentName, userId]);
};

export { useTrackDocumentChanges };
