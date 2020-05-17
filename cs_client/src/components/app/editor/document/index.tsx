import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { RichText } from '::app/editor/document/rich-text';
import { appActionCreators, TState } from '::app/reducer';
import { useSaveDocument } from '::app/editor/document/hooks/save-document/save-document';
import { useGetDocumentMeta } from '::app/editor/document/hooks/get-document-meta/get-document-meta';
import { documentReducer } from '::app/editor/document/reducer/reducer';
import { documentInitialState } from '::app/editor/document/reducer/initial-state';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';
import { DocumentContext } from './reducer/context';
import { useTrackDocumentChanges } from '::app/editor/document/hooks/track-document-changes';

type Props = {
  state: TState;
};

const Document: React.FC<Props> = ({ state }) => {
  const {
    showTree,
    saveDocument,
    reloadDocument,
    selectedFile,
    contentEditable,
    isOnMobile,
    processLinks,
    documentHasUnsavedChanges,
  } = state;
  const [documentState, dispatch] = useReducer(
    documentReducer,
    documentInitialState,
  );
  useEffect(() => {
    documentActionCreators.setDispatch(dispatch);
  }, []);
  const history = useHistory();
  const match = useRouteMatch<{ file_id: string }>();
  const { file_id } = match.params;

  const { nodes, loading: fetchingDocumentMeta } = useGetDocumentMeta({
    file_id,
    selectedFile,
    reloadRequestID: reloadDocument,
    cacheTimeStamp: documentState.cacheTimeStamp,
  });

  useSaveDocument({
    saveDocumentCommandID: saveDocument,
    documentHasUnsavedChanges,
  });

  useTrackDocumentChanges({ documentState });
  useEffect(() => {
    if (history.location.pathname.endsWith(file_id))
      appActionCreators.selectNode(undefined);
  }, [history.location.pathname]);
  return (
    <DocumentContext.Provider value={documentState}>
      <LinearProgress loading={fetchingDocumentMeta} />
      {nodes && (
        <Fragment>
          {state.selectedNode && (
            <RecentNodes state={state} file_id={file_id} />
          )}
          {showTree && (
            <ErrorBoundary>
              <Tree nodes={nodes} />
            </ErrorBoundary>
          )}

          <Route
            exact
            path={`/document/:file_id/node/:node_id/`}
            render={props => {
              return (
                <ErrorBoundary>
                  <RichText
                    {...props}
                    nodes={nodes}
                    file_id={file_id}
                    reloadRequestIDs={[String(reloadDocument)]}
                    contentEditable={contentEditable || !isOnMobile}
                    processLinks={processLinks}
                  />
                </ErrorBoundary>
              );
            }}
          />
        </Fragment>
      )}
    </DocumentContext.Provider>
  );
};

export { Document };
export default Document;
