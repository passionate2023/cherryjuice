import { useEffect } from 'react';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';
import { ac } from '::store/store';

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
    ac.document.hasUnsavedChanges(documentHasUnsavedNodes);
    if (documentHasUnsavedNodes) {
      onBeforeUnload.attach();
    } else onBeforeUnload.remove();
    return onBeforeUnload.remove;
  }, [cacheTimeStamp]);
};

export { useTrackDocumentChanges };
