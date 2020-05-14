import { useEffect, useRef } from 'react';
import { appActionCreators, TState } from '::app/reducer';

const useDocumentEditedIndicator = ({ documentHasUnsavedChanges }: TState) => {
  const originalWindowTitle = useRef(document.title);
  useEffect(() => {
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedChanges);
    if (documentHasUnsavedChanges) {
      document.title = '*' + originalWindowTitle.current;
    } else {
      document.title = originalWindowTitle.current;
    }
  }, [documentHasUnsavedChanges]);
};

export { useDocumentEditedIndicator };
