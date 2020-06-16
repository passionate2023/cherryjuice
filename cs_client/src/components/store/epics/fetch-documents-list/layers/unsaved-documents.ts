import { DocumentMeta } from '::types/generated';
import { apolloCache } from '::graphql/cache/apollo-cache';

const addUnsavedDocuments = (documents: DocumentMeta[]): DocumentMeta[] => {
  for (const docId of apolloCache.changes.document().created) {
    const document = apolloCache.document.get(docId);
    documents.push({ ...document, name: `*${document.name}` });
  }
  return [...documents];
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
