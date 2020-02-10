import * as React from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { QUERY_CT_NODE_META } from '::graphql/queries';
import { Ct_Node_Meta } from '::types/generated';
import { Fragment, Ref, useMemo, useRef } from 'react';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { appActions } from '::app/reducer';
import { RichText } from '::app/document/rich-text';
import { MUTATE_CT_NODE_CONTENT } from '::graphql/mutations';

type Props = {
  showTree: boolean;
  treeRef: Ref<React.FC>;
  dispatch: (action: { type: string; value?: any }) => void;
  onResize: () => void;
  recentNodes: any;
  selectedNode: any;
  selectedFile: string;
  saveDocument: number;
  reloadDocument: number;
};

const Document: React.FC<Props> = ({
  showTree,
  treeRef,
  dispatch,
  onResize,
  selectedNode,
  recentNodes,
  selectedFile,
  saveDocument,
  reloadDocument
}) => {
  const history = useHistory();
  const match = useRouteMatch();
  // @ts-ignore
  const { file_id } = match.params;
  const { loading, error, data } = useQuery(QUERY_CT_NODE_META, {
    variables: { file_id: file_id || '' }
  });

  const nodes: Map<number, Ct_Node_Meta> = useMemo(() => {
    if (data && data.ct_node_meta) {
      return new Map(data.ct_node_meta.map(node => [node.node_id, node]));
    }
  }, [loading, file_id]);
  if (error) {
    if (file_id && file_id === selectedFile) {
      dispatch({ type: appActions.SELECT_FILE, value: undefined });
      history.push('/');
    } else {
      history.push('/' + selectedFile);
    }
  } else if (file_id !== selectedFile) {
    dispatch({ type: appActions.SELECT_FILE, value: file_id });
  }
  return (
    <>
      <LinearProgress loading={loading} />
      {nodes && (
        <Fragment>
          <RecentNodes
            recentNodes={recentNodes}
            selectedNode={selectedNode}
            dispatch={dispatch}
            file_id={file_id}
          />
          {showTree && (
            <ErrorBoundary>
              <Tree
                nodes={nodes}
                treeRef={treeRef}
                onResize={onResize}
                dispatch={dispatch}
              />
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
                    file_id={file_id}
                    saveDocument={saveDocument}
                    reloadDocument={reloadDocument}
                    dispatch={dispatch}
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
