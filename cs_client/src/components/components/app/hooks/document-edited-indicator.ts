import { useEffect } from 'react';

const useDocumentEditedIndicator = (documentHasUnsavedChanges: boolean) => {
  useEffect(() => {
    if (documentHasUnsavedChanges) {
      document.title = '*' + 'cherryscript';
    } else {
      document.title = 'cherryscript';
    }
  }, [documentHasUnsavedChanges]);
};

export { useDocumentEditedIndicator };
