import { of } from 'rxjs';
import { documentActionCreators } from '::root/store/ducks/document';
import { tap } from 'rxjs/operators';
import { clearLocalChanges } from '::app/editor/document/hooks/get-document-meta/helpers/clear-local-changes';

const resetCache = of(documentActionCreators.setCacheTimeStamp(0)).pipe(
  tap(() => {
    clearLocalChanges();
  }),
);

export { resetCache };
