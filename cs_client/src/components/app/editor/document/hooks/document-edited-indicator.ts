import { useEffect, useRef } from 'react';
import { TDocumentState } from '::app/editor/document/reducer/initial-state';

type Props = {
  documentState: TDocumentState;
};
const useDocumentEditedIndicator = ({ documentState }: Props) => {
  const originalWindowTitle = useRef(document.title);
  useEffect(() => {
    if (documentState.documentHasUnsavedNodes) {
      document.title = '*' + originalWindowTitle.current;
    } else {
      document.title = originalWindowTitle.current;
    }
  }, [documentState.documentHasUnsavedNodes]);
};

export { useDocumentEditedIndicator };
