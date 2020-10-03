import { useEffect } from 'react';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';
import { updateCachedHtmlAndImages } from '::root/components/app/components/editor/document/components/tree/components/node/helpers/apollo-cache';

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
  online,
}: Props) => {
  useEffect(() => {
    const prefix = userId && documentName ? `${documentName} - ` : '';
    const title = `${prefix}CherryJuice`;
    if (userHasUnsavedChanges) {
      document.title = '*' + title;
      onBeforeUnload.attach({
        showPrompt: process.env.NODE_ENV === 'production' && online,
        callbacks: [updateCachedHtmlAndImages],
      });
    } else {
      onBeforeUnload.remove();
      document.title = title;
    }
  }, [userHasUnsavedChanges, documentName, userId]);
};

export { useTrackDocumentChanges };
