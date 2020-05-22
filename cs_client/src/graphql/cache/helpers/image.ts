import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { CacheState } from '::graphql/cache/initial-state';

type UnsavedImage = {
  base64?: string;
  id: string;
  url?: string;
  index: number;
};
const imageHelpers = (state: CacheState) => ({
  get: (imageId: string): { base64: string; id: string } | UnsavedImage => {
    return state.cache?.data.get('Image:' + imageId);
  },
  delete: {
    hard: (nodeId: string) => (imageId: string): void => {
      state.cache.data.delete('Image:' + imageId);
      if (!state.modifications.image.deleted[nodeId])
        state.modifications.image.deleted[nodeId] = [];
      if (!state.modifications.image.deleted[nodeId].includes(imageId))
        state.modifications.image.deleted[nodeId].push(imageId);
      documentActionCreators.setCacheUpdated();
    },
  },
  create: (nodeId: string) => (image: UnsavedImage) => {
    state.cache.data.set('Image:' + image.id, image);
    const type = image.base64 ? 'base64' : 'url';
    if (!state.modifications.image.created[nodeId])
      state.modifications.image.created[nodeId] = { base64: [], url: [] };
    state.modifications.image.created[nodeId][type].push(image.id);
    documentActionCreators.setCacheUpdated();
  },
});

export { imageHelpers };
export { UnsavedImage };
