import * as React from 'react';
import { Fragment, useMemo } from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { QUERY_CT_NODE_META } from '::graphql/queries';
import { Ct_Node_Meta } from '::types/generated';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { appActionCreators } from '::app/reducer';
import { RichText } from '::app/editor/document/rich-text';
import { TState } from '::app/reducer';
import { useReloadQuery } from '::hooks/use-reload-query';
import { useQueryTimeout } from '::hooks/use-query-timeout';

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
  } = state;
  const history = useHistory();
  const match = useRouteMatch();
  // @ts-ignore
  const { file_id } = match.params;
  const queryVariables = { file_id: file_id || '' };
  const { data, error, loading } = useReloadQuery(
    {
      reloadRequestID: reloadDocument,
    },
    {
      query: QUERY_CT_NODE_META,
      queryVariables,
    },
  );
  useQueryTimeout({
    queryData: data,
    queryError: error,
    queryVariables,
  });
  const nodes: Map<number, Ct_Node_Meta> = useMemo(() => {
    if (data && data.ct_node_meta) {
      return new Map(data.ct_node_meta.map(node => [node.node_id, node]));
    }
  }, [loading, file_id]);
  if (error) {
    if (file_id && file_id === selectedFile) {
      appActionCreators.selectFile(undefined);
      history.push('/');
    } else {
      history.push('/' + selectedFile);
    }
  } else if (file_id !== selectedFile) {
    appActionCreators.selectFile(file_id);
  }

  return (
    <>
      <LinearProgress loading={loading} />
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
            path={`/:file_id/node-:node_id/`}
            render={props => {
              return (
                <ErrorBoundary>
                  <RichText
                    {...props}
                    nodes={nodes}
                    file_id={file_id}
                    saveDocument={saveDocument}
                    reloadDocument={reloadDocument}
                    contentEditable={contentEditable || !isOnMobile}
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
