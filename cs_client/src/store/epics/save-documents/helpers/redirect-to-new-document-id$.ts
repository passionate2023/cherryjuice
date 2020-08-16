import { SaveOperationState } from '::store/epics/save-documents/helpers/save-document/helpers/save-deleted-nodes';
import { ac } from '::store/store';
import { EMPTY, of } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

const redirectToNewDocumentId$ = (state: SaveOperationState) => {
  const createdDocuments = Object.values(state.swappedDocumentIds);

  if (location.pathname.startsWith('/document/new-document')) {
    const newDocumentId = createdDocuments.pop();
    return of(ac.__.document.setDocumentId(newDocumentId));
  } else return EMPTY.pipe(ignoreElements());
};

export { redirectToNewDocumentId$ };
