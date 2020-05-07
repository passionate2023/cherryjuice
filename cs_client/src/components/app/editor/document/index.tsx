import * as React from 'react';
import { Fragment, useEffect, useReducer } from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useRouteMatch } from 'react-router-dom';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { RichText } from '::app/editor/document/rich-text';
import { TState } from '::app/reducer';
import { useSaveDocument } from '::app/editor/document/hooks/save-document';
import { useGetDocumentMeta } from '::app/editor/document/hooks/get-document-meta';
import { documentReducer } from '::app/editor/document/reducer/reducer';
import { documentInitialState } from '::app/editor/document/reducer/initial-state';
import { documentActionCreators } from '::app/editor/document/reducer/action-creators';

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
  } = state;
  const [, dispatch] = useReducer(
    documentReducer,
    documentInitialState,
  );
  useEffect(() => {
    documentActionCreators.setDispatch(dispatch);
  }, []);
  const match = useRouteMatch();
  // @ts-ignore
  const { file_id } = match.params;

  const { nodes, loading: fetchingDocumentMeta } = useGetDocumentMeta(
    file_id,
    selectedFile,
    reloadDocument,
  );

  const { loading: savingInProgress } = useSaveDocument(
    saveDocument,
    file_id,
    String(state.selectedNode.id),
    String(state.selectedNode.nodeId),
  );

  return (
    <>
      <LinearProgress loading={fetchingDocumentMeta || savingInProgress} />
      {nodes && (
        <Fragment>
          {<RecentNodes state={state} file_id={file_id} />}
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
    </>
  );
};

export { Document };
export default Document;
