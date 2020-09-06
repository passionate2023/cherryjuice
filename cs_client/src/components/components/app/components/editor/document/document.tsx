import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::root/components/shared-components/react/error-boundary';
import { Tree } from './components/tree/tree';
import { Route } from 'react-router-dom';
import { LinearProgress } from '::root/components/shared-components/loading-indicator/linear-progress';
import { RichText } from '::root/components/app/components/editor/document/components/rich-text/rich-text';
import { documentReducer } from '::root/components/app/components/editor/document/reducer/reducer';
import { documentInitialState } from '::root/components/app/components/editor/document/reducer/initial-state';
import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { DocumentContext } from './reducer/context';
import { Store } from '::store/store';
import { connect, ConnectedProps } from 'react-redux';
import { getCurrentDocument } from '::store/selectors/cache/document/document';
import { TitleAndRecentNodes } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/title-and-recent-nodes';

const mapState = (state: Store) => {
  const document = getCurrentDocument(state);
  return {
    nodes: document?.nodes,
    fetchDocumentInProgress:
      state.document.asyncOperations.fetch === 'in-progress',
    saveInProgress: state.document.asyncOperations.save === 'in-progress',
    selectedNode_id: document.state?.selectedNode_id,
    showTree: state.editor.showTree,
  };
};

const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Document: React.FC<Props & PropsFromRedux> = ({
  nodes,
  fetchDocumentInProgress,
  saveInProgress,
  selectedNode_id,
  showTree,
}) => {
  const [documentState, dispatch] = useReducer(
    documentReducer,
    documentInitialState,
  );
  useEffect(() => {
    documentActionCreators.setDispatch(dispatch);
  }, []);

  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress loading={fetchDocumentInProgress || saveInProgress} />
      {nodes && (
        <Fragment>
          {Boolean(selectedNode_id) && <TitleAndRecentNodes />}
          {showTree && (
            <ErrorBoundary>
              <Tree />
            </ErrorBoundary>
          )}

          <Route
            exact
            path={`/document/:file_id/node/:node_id/`}
            render={() => <RichText node={nodes[selectedNode_id]} />}
          />
        </Fragment>
      )}
    </DocumentContext.Provider>
  );
};

export default connector(Document);
