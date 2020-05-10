enum actions {
  SET_FETCHED_IMAGE_IDS,
  SET_NODE_CONTENT_HAS_CHANGED,
  SET_NODE_META_HAS_CHANGED,
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
    setNodeContentHasChanged: (nodeId: string) =>
      state.dispatch({
        type: actions.SET_NODE_CONTENT_HAS_CHANGED,
        value: { nodeId },
      }),
    setNodeMetaHasChanged: (nodeId: string, changedKeys: string[]) =>
      state.dispatch({
        type: actions.SET_NODE_META_HAS_CHANGED,
        value: { nodeId, changedKeys },
      }),
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
