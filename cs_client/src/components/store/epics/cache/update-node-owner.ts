import { ignoreElements, switchMap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { ofType } from 'deox';
import { ac, store } from '::root/store/store';
import { Actions } from '../../actions.types';
import { apolloCache } from '::graphql/cache/apollo-cache';
import { NodeOwnerIt } from '::types/graphql/generated';

const updateNodeOwner = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.cache.updateDocumentOwner]),
    switchMap(({ payload }) => {
      const isDocumentPublic = payload;
      const nodes = store.getState().document.nodes;
      if (nodes) {
        if (nodes.get(0)?.owner?.public !== isDocumentPublic)
          Array.from(nodes.values()).forEach(node => {
            apolloCache.node.mutate({
              nodeId: node.id,
              meta: {
                owner: {
                  ...node.owner,
                  public: isDocumentPublic,
                } as NodeOwnerIt,
              },
            });
          });
      }

      return EMPTY.pipe(ignoreElements());
    }),
  );
};

export { updateNodeOwner };
