import { useEffect } from 'react';
import { appActionCreators } from '::app/reducer';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::app/editor/document/rich-text/hooks/get-node-images';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';

type Props = {
  cacheTimeStamp: number;
  documentId: string;
};
const useTrackDocumentChanges = ({ cacheTimeStamp }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes =
      Boolean(cacheTimeStamp) &&
      (Boolean(getEditor()?.getAttribute('data-edited')) ||
        Boolean(apolloCache.changes.document().unsaved));
    appActionCreators.documentHasUnsavedChanges(documentHasUnsavedNodes);
    if (documentHasUnsavedNodes) {
      onBeforeUnload.attach();
    } else onBeforeUnload.remove();
    return onBeforeUnload.remove;
  }, [cacheTimeStamp]);
};

export { useTrackDocumentChanges };
