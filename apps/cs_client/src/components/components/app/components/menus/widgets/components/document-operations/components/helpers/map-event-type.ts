import {
  DocumentOperation,
  OPERATION_STATE,
  OPERATION_TYPE,
} from '::types/graphql';

const eventType = {
  [OPERATION_TYPE.DELETE]: ['deletion', 'deleting'],
  [OPERATION_TYPE.EXPORT]: ['export', 'exporting'],
  [OPERATION_TYPE.IMPORT]: ['import', 'importing'],
  [OPERATION_TYPE.CLONE]: ['cloning', 'cloning'],
  [OPERATION_TYPE.CACHE]: ['caching', 'caching'],
};
const eventState = {
  [OPERATION_STATE.STARTED]: 'in progress',
  [OPERATION_STATE.PENDING]: 'pending',
  [OPERATION_STATE.PREPARING]: 'preparing',
  [OPERATION_STATE.FINISHED]: 'finished',
  [OPERATION_STATE.FAILED]: 'failed',
  [OPERATION_STATE.DUPLICATE]: 'failed',
};

const mapEventType = ({ state, type, context }: DocumentOperation): string => {
  if (context) return `${eventType[type][1]} ${context}`.toLowerCase();
  else return `${eventType[type][0]} ${eventState[state]}`.toLowerCase();
};

export { mapEventType };
