enum actions {
  SET_FETCHED_IMAGE_IDS,
  setCacheUpdated,
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
    setCacheUpdated: () => {
      state.dispatch({
        type: actions.setCacheUpdated,
        value: { reset: false },
      });
    },
    resetCacheUpdated: () => {
      state.dispatch({ type: actions.setCacheUpdated, value: { reset: true } });
    },
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
