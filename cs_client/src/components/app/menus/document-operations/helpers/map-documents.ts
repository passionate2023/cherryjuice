import { ActiveImports } from '../import-progress';

const mapDocuments = (activeImports: ActiveImports) =>
  Object.values(activeImports).map(document => ({
    key: document.documentId,
    name: document.documentName,
    id: document.documentId,
    eventType: document.eventType,
  }));
export { mapDocuments };
