import { documentActionCreators } from '../../../components/app/editor/document/reducer/action-creators';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { cacheInitialState, CacheState } from '../initial-state';

enum localChanges {
  NODE_META,
  NODE_CONTENT,
  NODE_CREATED,
  NODE_DELETED,
  DOCUMENT_CREATED,
  ALL,
}

const fn = obj =>
  Object.entries(obj)
    .filter(([, isModified]) => isModified)
    .map(([id]) => id);

const changesHelpers = (state: CacheState) => ({
  document: {
    get created(): string[] {
      return fn(state.modifications.document);
    },
  },
  node: {
    get html(): string[] {
      return Object.entries(state.modifications.node.content)
        .filter(([, { html }]) => html)
        .map(([nodeId]) => nodeId);
    },
    get meta(): [string, string[]][] {
      return Object.keys(state.modifications.node.meta).reduce(
        (acc, nodeId) => {
          const attributes = fn(state.modifications.node.meta[nodeId]);
          if (attributes.length) acc.push([nodeId, attributes]);
          return acc;
        },
        [],
      );
    },
    get created(): string[] {
      return fn(state.modifications.node.created);
    },
    get deleted(): string[] {
      return fn(state.modifications.node.deleted);
    },
  },
  image: {
    get deleted(): { [nodeId: string]: string[] } {
      return cloneObj(state.modifications.image.deleted);
    },
  },
  isNodeNew: (nodeId: string): boolean =>
    state.modifications.node.created[nodeId],
  unsetModificationFlag: (type: localChanges, id?: string) => {
    if (type === localChanges.DOCUMENT_CREATED) {
      delete state.modifications.document[id];
    } else if (type === localChanges.NODE_CREATED) {
      delete state.modifications.node.created[id];
    } else if (type === localChanges.NODE_META) {
      delete state.modifications.node.meta[id];
    } else if (type === localChanges.NODE_DELETED) {
      delete state.modifications.node.deleted[id];
    } else if (type === localChanges.ALL) {
      state.modifications = {
        ...cloneObj(cacheInitialState.modifications),
      };
      documentActionCreators.resetCacheUpdated();
    }
  },
});
export { changesHelpers };
export { localChanges };
