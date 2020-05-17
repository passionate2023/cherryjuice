import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { TEditedNodes } from '::app/editor/document/reducer/initial-state';
import { apolloCache } from '::graphql/cache-helpers';

const clearLocalChanges = (localChanges: TEditedNodes) => {
  Object.keys(localChanges).forEach(nodeId => {
    apolloCache.deleteNode(nodeId);
  });
  documentActionCreators.clearAllLocalChanges();
};

export { clearLocalChanges };
