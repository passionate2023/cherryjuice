import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { CacheState } from '::graphql/cache/initial-state';

const imageHelpers = (state: CacheState) => ({
  delete: (nodeId: string) => (imageId: string): void => {
    state.cache.data.delete('Image:' + imageId);
    if (!state.modifications.node.content.deletedImages[nodeId])
      state.modifications.node.content.deletedImages[nodeId] = {};
    state.modifications.node.content.deletedImages[nodeId][imageId] = true;
    documentActionCreators.setCacheUpdated();
  },
});

export { imageHelpers };
