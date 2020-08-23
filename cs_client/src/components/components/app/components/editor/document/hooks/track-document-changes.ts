import { useEffect } from 'react';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';

type Props = {
  userHasUnsavedChanges: boolean;
  documentName?: string;
};
const useTrackDocumentChanges = ({
  userHasUnsavedChanges,
  documentName,
}: Props) => {
  useEffect(() => {
    const title = `${documentName ? documentName + ' - ' : ''}Cherryscript`;
    if (userHasUnsavedChanges) {
      document.title = '*' + title;
      onBeforeUnload.attach();
    } else {
      onBeforeUnload.remove();
      document.title = title;
    }
    return () => {
      document.title = 'Cherryscript';
      onBeforeUnload.remove();
    };
  }, [userHasUnsavedChanges, documentName]);
};

export { useTrackDocumentChanges };
