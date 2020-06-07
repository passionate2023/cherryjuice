enum actions {
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
    pastedImages: () => {
      state.dispatch({ type: actions.pastedImages });
    },
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
