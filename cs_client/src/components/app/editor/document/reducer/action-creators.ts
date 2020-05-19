enum actions {
  setCacheUpdated,
}

const actionCreators = (() => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: (dispatch): void => (state.dispatch = dispatch),
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
