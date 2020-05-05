enum actions {
  SET_IMAGE_IDS,
}

const actionCreators = (() => {
  const state = {
    // eslint-disable-next-line no-unused-vars
    dispatch: props => Error('dispatcher not set'),
  };
  return {
    setDispatch: (dispatch): void => (state.dispatch = dispatch),
    setImageIDs: (node_id: string, imageIDs: string[]) =>
      state.dispatch({
        type: actions.SET_IMAGE_IDS,
        value: { node_id, imageIDs },
      }),
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
