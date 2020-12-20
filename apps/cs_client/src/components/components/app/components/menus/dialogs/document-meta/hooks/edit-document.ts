import { useCallback } from 'react';
import { ac } from '::store/store';

export const useEditDocument = ({ state, focusedDocument }) => {
  return useCallback(() => {
    const focusedDocumentId = focusedDocument.id;
    const meta = Object.fromEntries(
      Object.entries(state).reduce((entries, [k, v]) => {
        const notEqual =
          typeof v === 'string'
            ? focusedDocument[k] !== v
            : Array.isArray(v)
            ? JSON.stringify(v.sort()) !==
              JSON.stringify(focusedDocument[k]?.sort())
            : JSON.stringify(Object.entries(focusedDocument[k]).sort()) !==
              JSON.stringify(Object.entries(v).sort());
        if (notEqual) entries.push([k, v]);
        return entries;
      }, []),
    );
    ac.documentCache.mutateDocument({ documentId: focusedDocumentId, meta });
    ac.documentsList.fetchDocuments();
  }, [state, focusedDocument]);
};
