import { useEffect } from 'react';
import { TDocumentState } from '::app/editor/document/reducer/initial-state';
import { appActionCreators } from '::app/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';

type Props = {
  documentState: TDocumentState;
};
const useTrackDocumentChanges = ({ documentState }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes =
      Boolean(apolloCache.changes.node.meta.length) ||
      Boolean(apolloCache.changes.node.html.length);
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedNodes);
  }, [documentState.cacheTimeStamp]);
};

export { useTrackDocumentChanges };
