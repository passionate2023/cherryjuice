import { useEffect } from 'react';
import { appActionCreators } from '::app/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';

type Props = {
  cacheTimeStamp: number;
};
const useTrackDocumentChanges = ({ cacheTimeStamp }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes =
      Boolean(cacheTimeStamp) &&
      (Boolean(getEditor()?.getAttribute('data-edited')) ||
        Boolean(apolloCache.changes.node.created.length) ||
        Boolean(apolloCache.changes.node.meta.length) ||
        Boolean(apolloCache.changes.node.html.length) ||
        Boolean(apolloCache.changes.document.created.length));
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedNodes);
  }, [cacheTimeStamp]);
};

export { useTrackDocumentChanges };
