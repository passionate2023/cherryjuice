import { useEffect } from 'react';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { onBeforeUnload } from '::helpers/dom/on-before-unload';

type Props = {
  updatedAt: number;
  localUpdatedAt: number;
};
const useTrackDocumentChanges = ({ updatedAt, localUpdatedAt }: Props) => {
  useEffect(() => {
    const documentHasUnsavedNodes =
      Boolean(getEditor()?.getAttribute('data-edited')) ||
      localUpdatedAt > updatedAt;
    if (documentHasUnsavedNodes) {
      onBeforeUnload.attach();
    } else onBeforeUnload.remove();
    return onBeforeUnload.remove;
  }, [updatedAt, localUpdatedAt]);
};

export { useTrackDocumentChanges };
