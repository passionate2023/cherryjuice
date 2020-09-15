import { concatMap, filter, map } from 'rxjs/operators';
import { concat, defer, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac_, store } from '::store/store';
import { Actions } from '../../actions.types';
import { gqlQuery } from '::store/epics/shared/gql-query';
import { createErrorHandler } from '::store/epics/shared/create-error-handler';
import { NODE_HTML } from '::graphql/queries/node-html';
import { getNode } from '::store/selectors/cache/document/node';
import { FETCH_NODE_IMAGES } from '::graphql/queries/node-images';

export type FetchContentProps = {
  documentId: string;
  node_ids: number[];
};
export const fetchNodeHtml = ({ node_ids, documentId }: FetchContentProps) =>
  defer(() =>
    gqlQuery(
      NODE_HTML({
        file_id: documentId,
        node_ids,
      }),
    ).pipe(
      map(nodeHtmls =>
        ac_.documentCache.addFetchedFields(
          nodeHtmls.map(({ html, node_id }) => ({
            node_id,
            documentId,
            data: { html },
          })),
        ),
      ),
    ),
  );
export const fetchNodeImages = (
  { node_ids, documentId }: FetchContentProps,
  thumbnail = false,
) =>
  defer(() =>
    gqlQuery(
      FETCH_NODE_IMAGES({
        file_id: documentId,
        node_ids,
        thumbnail,
      }),
    ).pipe(
      map(images =>
        ac_.documentCache.addFetchedFields(
          images
            .filter(({ image }) => !!image.length)
            .map(({ image, node_id }) => ({
              node_id,
              documentId,
              data: { image },
            })),
        ),
      ),
    ),
  );
const fetchNodeEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac_.node.fetch]),
    filter(({ payload: { node_id, documentId } }) => {
      const nodeHasNoHtml = !getNode({ documentId, node_id })?.html;
      const nodeFetchIdle =
        store.getState().node.asyncOperations.fetch[node_id] !== 'in-progress';
      const validNode_id = node_id > 0;
      return validNode_id && nodeFetchIdle && nodeHasNoHtml;
    }),
    concatMap(({ payload: { node_id, documentId } }) => {
      const loading = of(ac_.node.fetchInProgress(node_id));
      const fulfilled = of(ac_.node.fetchFulfilled(node_id));
      const fetchHtml$ = fetchNodeHtml({ documentId, node_ids: [node_id] });
      const fetchImagesThumbnails$ = fetchNodeImages(
        { documentId, node_ids: [node_id] },
        true,
      );
      const fetchImages$ = fetchNodeImages({ documentId, node_ids: [node_id] });
      return concat(
        loading,
        fetchHtml$,
        fulfilled,
        fetchImagesThumbnails$,
        fetchImages$,
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the node',
            description: 'Check your network connection',
          },
          actionCreators: [ac_.node.fetchFailed],
        }),
      );
    }),
  );
};

export { fetchNodeEpic };
