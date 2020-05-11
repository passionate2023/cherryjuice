enum actions {
  SET_FETCHED_IMAGE_IDS,
  SET_NODE_CONTENT_HAS_CHANGED,
  SET_NODE_META_HAS_CHANGED,
  CREATE_NEW_NODE,
  CLEAR_LOCAL_CHANGES,
}
enum localChanges {
  META,
  CONTENT,
  IS_NEW,
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
    createNewNode: (nodeId: string) =>
      state.dispatch({
        type: actions.CREATE_NEW_NODE,
        value: { nodeId },
      }),
    clearLocalChanges: (nodeId: string, level: localChanges) =>
      state.dispatch({
        type: actions.CLEAR_LOCAL_CHANGES,
        value: { nodeId, level },
      }),
  };
})();

export { actionCreators as documentActionCreators, actions as documentActions };
export { localChanges };
