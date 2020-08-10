import { CacheState } from '::graphql/cache/initial-state';
import { documentActionCreators } from '::store/ducks/document';

type UnsavedImage = {
  base64?: string;
  id: string;
};
type NodeIdDocumentId = { documentId: string; nodeId: string };
const imageHelpers = (state: CacheState) => ({
  get: (imageId: string): { base64: string; id: string } | UnsavedImage => {
    return state.cache?.data.get('Image:' + imageId);
  },
  delete: {
    hard: ({ nodeId, documentId }: NodeIdDocumentId) => (
      imageId: string,
    ): void => {
      state.cache.data.delete('Image:' + imageId);
      const unmodifiedNodeImages = !state.modifications.document[
        documentId
      ].image.deleted.has(nodeId);
      if (unmodifiedNodeImages)
        state.modifications.document[documentId].image.deleted.set(
          nodeId,
          new Set(),
        );
      state.modifications.document[documentId].image.deleted
        .get(nodeId)
        .add(imageId);
      documentActionCreators.setCacheTimeStamp();
    },
  },
  create: ({ nodeId, documentId }: NodeIdDocumentId) => (
    image: UnsavedImage,
  ) => {
    state.cache.data.set('Image:' + image.id, image);
    const unmodifiedNodeImages = !state.modifications.document[
      documentId
    ].image.created.has(nodeId);
    if (unmodifiedNodeImages)
      state.modifications.document[documentId].image.created.set(
        nodeId,
        new Set(),
      );
    state.modifications.document[documentId].image.created
      .get(nodeId)
      .add(image.id);
    documentActionCreators.setCacheTimeStamp();
  },
});

export { imageHelpers };
export { UnsavedImage, NodeIdDocumentId };
