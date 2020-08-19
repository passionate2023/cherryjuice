import { concatMap, filter, map } from 'rxjs/operators';
import { concat, defer, Observable, of } from 'rxjs';
import { ofType } from 'deox';
import { ac } from '::store/store';
import { Actions } from '../actions.types';
import { gqlQuery } from '::store/epics/shared/gql-query';
import { createErrorHandler } from '::store/epics/shared/create-error-handler';
import { NODE_HTML } from '::graphql/queries/node-html';
import { getNode } from '::store/selectors/cache/document/node';
import { FETCH_NODE_IMAGES } from '::graphql/queries/node-images';

const fetchHtmlEpic = (action$: Observable<Actions>) => {
  return action$.pipe(
    ofType([ac.__.document.selectNode]),
    filter(({ payload: { node_id, documentId } }) => {
      return !!node_id && !getNode({ documentId, node_id })?.html;
    }),
    concatMap(({ payload: { node_id, documentId } }) => {
      const fetchHtml = gqlQuery(
        NODE_HTML({
          file_id: documentId,
          node_id,
        }),
      ).pipe(
        map(({ html }) =>
          ac.__.documentCache.addFetchedFields({
            node_id,
            documentId,
            data: { html },
          }),
        ),
      );

      const fetchImagesThumbnails = defer(() =>
        gqlQuery(
          FETCH_NODE_IMAGES({
            file_id: documentId,
            node_id,
            thumbnail: true,
          }),
        ).pipe(
          filter(({ image }) => !!image.length),
          map(({ image }) =>
            ac.__.documentCache.addFetchedFields({
              node_id,
              documentId,
              data: { image },
            }),
          ),
        ),
      );
      const fetchImages = defer(() =>
        gqlQuery(
          FETCH_NODE_IMAGES({
            file_id: documentId,
            node_id,
          }),
        ).pipe(
          filter(({ image }) => !!image.length),
          map(({ image }) =>
            ac.__.documentCache.addFetchedFields({
              node_id,
              documentId,
              data: { image },
            }),
          ),
        ),
      );
      const loading = of(ac.__.node.fetchStarted());
      const fulfilled = of(ac.__.node.fetchFulfilled());
      return concat(
        loading,
        fetchHtml,
        fulfilled,
        fetchImagesThumbnails,
        fetchImages,
      ).pipe(
        createErrorHandler({
          alertDetails: {
            title: 'Could not fetch the node',
            description: 'Check your network connection',
          },
          actionCreators: [ac.__.node.fetchFailed],
        }),
      );
    }),
  );
};

export { fetchHtmlEpic };
