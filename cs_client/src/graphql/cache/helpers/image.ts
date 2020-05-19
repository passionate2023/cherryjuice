import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { CacheState } from '::graphql/cache/initial-state';

const imageHelpers = (state: CacheState) => ({
  delete: {
    hard: (nodeId: string) => (imageId: string): void => {
      state.cache.data.delete('Image:' + imageId);
      if (!state.modifications.image.deleted[nodeId])
        state.modifications.image.deleted[nodeId] = [];
      state.modifications.image.deleted[nodeId].push(imageId);
      documentActionCreators.setCacheUpdated();
    },
  },
});

export { imageHelpers };
