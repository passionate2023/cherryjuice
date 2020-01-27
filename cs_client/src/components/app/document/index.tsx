import * as React from 'react';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Tree } from './tree';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { RichText } from './rich-text';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CT_NODE_META } from '::graphql/queries';
import { Ct_Node_Meta } from '::types/generated';
import { Fragment, Ref, useMemo } from 'react';
import { LinearProgress } from '::shared-components/linear-progress';
import { RecentNodes } from './recent-nodes/recent-nodes';
import { appActions } from '::app/reducer';
import { RichTextSsHtml } from '::app/document/rich-text-sshtml';

type Props = {
  showTree: boolean;
  treeRef: Ref<React.FC>;
  dispatch: (action: { type: string; value?: any }) => void;
  onResize: () => void;
  recentNodes: any;
  selectedNode: any;
  serverSideHtml: boolean;
};

const Document: React.FC<Props> = ({
  showTree,
  treeRef,
  dispatch,
  onResize,
  selectedNode,
  recentNodes,
  serverSideHtml
}) => {
  const history = useHistory();
  const match = useRouteMatch();
  // @ts-ignore
  const { file_id, node_id } = match.params;
  const { loading, error, data } = useQuery(QUERY_CT_NODE_META, {
    variables: { file_id }
  });
  const nodes: Map<number, Ct_Node_Meta> = useMemo(() => {
    if (data && data.ct_node_meta) {
      return new Map(data.ct_node_meta.map(node => [node.node_id, node]));
    }
  }, [loading, file_id]);
  if (error) {
    dispatch({ type: appActions.SELECT_FILE, value: undefined });
    history.push('/');
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
              return serverSideHtml ? (
                <ErrorBoundary>
                  <RichTextSsHtml {...props} has_txt={true} file_id={file_id} />
                </ErrorBoundary>
              ) : (
                <ErrorBoundary>
                  <RichText {...props} has_txt={true} file_id={file_id} />
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
