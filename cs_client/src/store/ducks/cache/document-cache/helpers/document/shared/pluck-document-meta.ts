import { QDocumentMeta } from '::graphql/queries/document-meta';
import { CachedDocument } from '::store/ducks/cache/document-cache';

export const pluckProperties = (document: QDocumentMeta | CachedDocument) => ({
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
