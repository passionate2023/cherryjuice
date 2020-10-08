import { QDocumentMeta } from '::graphql/queries/document-meta';
import { CachedDocument } from '::store/ducks/document-cache/document-cache';
import { QDocumentsListItem } from '::graphql/fragments/document-list-item';

export const pluckProperties = (
  document: QDocumentsListItem | QDocumentMeta | CachedDocument,
) => ({
  userId: document.userId,
  name: document.name,
  size: document.size,
  folder: document.folder,
  guests: document.guests,
  hash: document.hash,
  id: document.id,
  privacy: document.privacy,
  privateNodes: document.privateNodes,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});
