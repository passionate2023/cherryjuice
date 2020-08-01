import { DocumentMeta } from '::types/graphql-adapters';
import { apolloCache } from '::graphql/cache/apollo-cache';

const addUnsavedDocuments = (documents: DocumentMeta[]): DocumentMeta[] => {
  const res = [...documents];
  for (const docId of apolloCache.changes.document().created) {
    const document = apolloCache.document.get(docId);
    res.push({ ...document });
  }
  return res;
};
const editedDocuments = (documents: DocumentMeta[]): DocumentMeta[] => {
  for (const docId of apolloCache.changes.document().unsaved) {
    const editedMeta = apolloCache.changes.document(docId).meta;
    const document = documents.find(document => document.id === docId);
    if (document) {
      Array.from(editedMeta).forEach(([k, v]) => {
        document[k] = v;
      });
    }
  }
  return [...documents];
};

export { addUnsavedDocuments, editedDocuments };
