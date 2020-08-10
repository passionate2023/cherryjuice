import { DOCUMENT_SUBSCRIPTIONS as DS } from '::types/graphql/generated';

const map = {
  ...{
    [DS.IMPORT_PENDING]: 'pending',
    [DS.IMPORT_PREPARING]: 'uploading',
    [DS.IMPORT_STARTED]: 'importing',
    [DS.IMPORT_FINISHED]: 'finished',
    [DS.IMPORT_FAILED]: 'failed',
    [DS.IMPORT_DUPLICATE]: 'duplicate',
  },
  ...{
    [DS.EXPORT_PENDING]: 'pending',
    [DS.EXPORT_PREPARING]: 'preparing',
    [DS.EXPORT_NODES_STARTED]: 'exporting nodes',
    [DS.EXPORT_IMAGES_STARTED]: 'exporting images',
    [DS.EXPORT_FINISHED]: 'finished',
    [DS.EXPORT_FAILED]: 'failed',
  },
};

const mapEventType = (value: DS): string => map[value];

export { mapEventType };
