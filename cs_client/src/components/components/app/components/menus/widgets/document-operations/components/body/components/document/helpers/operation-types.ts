import { DOCUMENT_SUBSCRIPTIONS as DS } from '::types/graphql/generated';

const OperationTypes = {
  import: {
    active: {
      [DS.IMPORT_PENDING]: true,
      [DS.IMPORT_PREPARING]: true,
      [DS.IMPORT_STARTED]: true,
    },
    successful: {
      [DS.IMPORT_FINISHED]: true,
    },
    blocked: {
      [DS.IMPORT_DUPLICATE]: true,
    },
    failed: {
      [DS.IMPORT_FAILED]: true,
    },
  },
  export: {
    active: {
      [DS.EXPORT_PENDING]: true,
      [DS.EXPORT_PREPARING]: true,
      [DS.EXPORT_NODES_STARTED]: true,
      [DS.EXPORT_IMAGES_STARTED]: true,
    },
    successful: {
      [DS.EXPORT_FINISHED]: true,
    },
    failed: {
      [DS.EXPORT_FAILED]: true,
    },
  },
};

export { OperationTypes };
