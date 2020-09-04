import { concat, EMPTY, merge, Observable, of } from 'rxjs';
import { Actions } from '::store/actions.types';
import { ofType } from 'deox';
import { ac_, store } from '::store/store';
import { debounceTime, ignoreElements, switchMap } from 'rxjs/operators';
import { router } from '::root/router/router';
import {
  getCurrentDocument,
  getDocuments,
} from '::store/selectors/cache/document/document';
import { extractDocumentFromPathname } from '::root/components/app/components/editor/hooks/document-routing/helpers/extract-document-from-pathname';

const routerEpic = (action$: Observable<Actions>) => {
  const setDocumentId$ = action$.pipe(
    ofType([ac_.document.setDocumentId]),
    switchMap(action => {
      if (action.payload) {
        const differentDocumentId =
          extractDocumentFromPathname().documentId !== action.payload;
        if (differentDocumentId) {
          const document = getDocuments(store.getState())[action.payload];
          if (document?.state?.selectedNode_id)
            router.goto.node(document.id, document.state.selectedNode_id);
          else router.goto.document(action.payload);
        }
        return EMPTY.pipe(ignoreElements());
      } else {
        router.goto.home();
        return of(ac_.dialogs.showDocumentList());
      }
    }),
  );

  const documentFetchFulfilled$ = action$.pipe(
    ofType([ac_.document.fetchFulfilled]),
    switchMap(() => {
      const document = getCurrentDocument(store.getState());
      const nextNode = store.getState().node.next;
      router.goto.node(
        document.id,
        nextNode?.documentId === document.id
          ? nextNode.node_id
          : document.state.selectedNode_id,
      );
      return nextNode
        ? concat(of(ac_.node.clearNext()), of(ac_.node.select(nextNode)))
        : EMPTY.pipe(ignoreElements());
    }),
  );

  const nodeSelect$ = action$.pipe(
    ofType([ac_.node.select]),
    switchMap(action => {
      router.goto.node(action.payload.documentId, action.payload.node_id);
      return EMPTY.pipe(ignoreElements());
    }),
  );
  const undoAction$ = action$.pipe(
    ofType([ac_.timelines.setDocumentActionNOF]),
    debounceTime(10),
    switchMap(() => {
      const document = getCurrentDocument(store.getState());
      router.goto.node(document.id, document.state.selectedNode_id);
      return EMPTY.pipe(ignoreElements());
    }),
  );
  const nodeDelete$ = action$.pipe(
    ofType([ac_.documentCache.deleteNode]),
    switchMap(() => {
      const document = getCurrentDocument(store.getState());
      if (document.state.selectedNode_id)
        router.goto.node(document.id, document.state.selectedNode_id);
      else router.goto.document(document.id);
      return EMPTY.pipe(ignoreElements());
    }),
  );
  const createNode$ = action$.pipe(
    ofType([ac_.documentCache.createNode]),
    switchMap(() => {
      const document = getCurrentDocument(store.getState());
      router.goto.node(document.id, document.state.selectedNode_id);
      return EMPTY.pipe(ignoreElements());
    }),
  );

  return merge(
    setDocumentId$,
    undoAction$,
    documentFetchFulfilled$,
    nodeSelect$,
    nodeDelete$,
    createNode$,
  );
};

export { routerEpic };
