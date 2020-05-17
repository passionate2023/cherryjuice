import { useEffect } from 'react';
import {
  TDocumentState,
  TEditedNode,
} from '::app/editor/document/reducer/initial-state';
import { appActionCreators } from '::app/reducer';

const nodeHasUnsavedChanges = ({ new: isNew, deleted, edited }: TEditedNode) =>
  isNew || deleted || edited?.meta?.length || edited?.content;

type Props = {
  documentState: TDocumentState;
};
const useTrackDocumentChanges = ({ documentState }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes = Object.values(documentState.nodes).some(
      nodeHasUnsavedChanges,
    );
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedNodes);
  }, [documentState.nodes]);
};

export { useTrackDocumentChanges };
