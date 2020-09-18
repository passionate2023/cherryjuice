import { OPERATION_STATE } from '::types/graphql/generated';

const OperationTypes = {
  active: {
    [OPERATION_STATE.PENDING]: true,
    [OPERATION_STATE.PREPARING]: true,
    [OPERATION_STATE.STARTED]: true,
  },
  successful: {
    [OPERATION_STATE.FINISHED]: true,
  },
  failed: {
    [OPERATION_STATE.FAILED]: true,
    [OPERATION_STATE.DUPLICATE]: true,
  },
  blocked: {
    [OPERATION_STATE.DUPLICATE]: true,
  },
};

export { OperationTypes };
