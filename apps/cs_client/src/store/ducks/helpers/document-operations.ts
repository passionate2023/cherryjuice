import { DOCUMENT_SUBSCRIPTIONS as DS } from '::types/graphql';
import {
  DOCUMENT_OPERATIONS as DO,
  DocumentOperations,
} from '../document-operation/document-operations';

const createFilterer = (statuses: (DS | DO)[]) => (
  operations: DocumentOperations,
) =>
  Object.fromEntries(
    Object.entries(operations).filter(
      ([, { status }]) => !statuses.includes(status),
    ),
  );

const filterStaleOperations = {
  deleted: createFilterer([DS.DELETED]),
  finished: createFilterer([DS.IMPORT_FINISHED, DS.EXPORT_FINISHED]),
};

export { filterStaleOperations };
