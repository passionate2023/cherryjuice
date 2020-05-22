import { useEffect } from 'react';
import { TDocumentState } from '::app/editor/document/reducer/initial-state';
import { appActionCreators } from '::app/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';

type Props = {
  documentState: TDocumentState;
};
const useTrackDocumentChanges = ({ documentState }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes =
      Boolean(getEditor()?.getAttribute('data-edited')) ||
      Boolean(apolloCache.changes.node.created.length) ||
      Boolean(apolloCache.changes.node.meta.length) ||
      Boolean(apolloCache.changes.node.html.length) ||
      Boolean(apolloCache.changes.document.created.length);
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedNodes);
  }, [documentState.cacheTimeStamp]);
};

export { useTrackDocumentChanges };
