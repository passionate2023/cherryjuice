import { interval } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { store } from '::store/store';

export const waitForDocumentToLoad = (
  documentId: string,
  callback: () => void,
) =>
  interval(5)
    .pipe(
      filter(() => {
        const currentDocument = getCurrentDocument(store.getState());
        return (
          currentDocument?.id === documentId &&
          currentDocument?.nodes &&
          Boolean(currentDocument.nodes[0])
        );
      }),
      take(1),
      tap(callback),
    )
    .subscribe();