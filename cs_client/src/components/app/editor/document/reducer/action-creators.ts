enum actions {
  SET_FETCHED_IMAGE_IDS,
  SET_NODE_HAS_CHANGED,
}

const actionCreators = (() => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: (dispatch): void => (state.dispatch = dispatch),
    setFetchedImageIDs: (nodeId: string, fetchedImageIDs: string[]) =>
      state.dispatch({
        type: actions.SET_FETCHED_IMAGE_IDS,
        value: { nodeId, fetchedImageIDs },
      }),
    setNodeHasChanged: (nodeId: string) =>
      state.dispatch({
        type: actions.SET_NODE_HAS_CHANGED,
        value: { nodeId },
      }),
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
