import { useEffect } from 'react';

type Props = {
  userHasUnsavedChanges: boolean;
  documentName?: string;
  userId?: string;
  online: boolean;
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
      // onBeforeUnload.attach({
      //   showPrompt: process.env.NODE_ENV === 'production' && online,
      //   callbacks: [updateCachedHtmlAndImages],
      // });
    } else {
      // onBeforeUnload.remove();
      document.title = title;
    }
  }, [userHasUnsavedChanges, documentName, userId]);
};

export { useTrackDocumentChanges };
