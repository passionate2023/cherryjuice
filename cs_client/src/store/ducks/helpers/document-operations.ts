import { DOCUMENT_SUBSCRIPTIONS as DS } from '::types/graphql/generated';
import { DocumentSubscriptions } from '../document-operations';

const createFilterer = (statuses: DS[]) => (
  operations: DocumentSubscriptions,
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
