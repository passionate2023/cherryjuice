import { useEffect, useRef } from 'react';

const useDocumentEditedIndicator = (documentHasUnsavedChanges: boolean) => {
  const originalWindowTitle = useRef(document.title);
  useEffect(() => {
    if (documentHasUnsavedChanges) {
      document.title = '*' + originalWindowTitle.current;
    } else {
      document.title = originalWindowTitle.current;
    }
  }, [documentHasUnsavedChanges]);
};

export { useDocumentEditedIndicator };
