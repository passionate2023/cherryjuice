import {
  DocumentOperation,
  OPERATION_STATE,
  OPERATION_TYPE,
} from '::types/graphql/generated';

const eventType = {
  [OPERATION_TYPE.DELETE]: 'deletion',
  [OPERATION_TYPE.EXPORT]: 'export',
  [OPERATION_TYPE.IMPORT]: 'import',
  [OPERATION_TYPE.CLONE]: 'cloning',
  [OPERATION_TYPE.CACHE]: 'caching',
};
const eventState = {
  [OPERATION_STATE.PENDING]: 'pending',
  [OPERATION_STATE.PREPARING]: 'preparing',
  [OPERATION_STATE.STARTED]: 'started',
  [OPERATION_STATE.FINISHED]: 'finished',
  [OPERATION_STATE.FAILED]: 'failed',
  [OPERATION_STATE.DUPLICATE]: 'failed',
};

const mapEventType = ({ state, type, context }: DocumentOperation): string => {
  if (context) {
    return `${eventType[type]}ing ${(context || '').toLowerCase()}`;
  } else if (state === OPERATION_STATE.PREPARING) {
    return `${eventState[state]} ${eventType[type]}    `;
  } else return `${eventType[type]} ${eventState[state]}`;
};

export { mapEventType };
