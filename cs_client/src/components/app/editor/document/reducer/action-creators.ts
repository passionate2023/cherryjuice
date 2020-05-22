enum actions {
  setCacheUpdated,
  pastedImages,
  savingInProgress,
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
    pastedImages: () => {
      state.dispatch({ type: actions.pastedImages });
    },
    setSavingInProgress: () => {
      state.dispatch({ type: actions.savingInProgress, value: true });
    },
    clearSavingInProgress: () => {
      state.dispatch({ type: actions.savingInProgress, value: false });
    },
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
