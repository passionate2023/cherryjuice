import { ApolloProvider } from '@apollo/react-common';
import { client } from '::graphql/apollo';
import { Route, useHistory } from 'react-router-dom';
import { Suspense } from 'react';
import * as React from 'react';
import { SelectFile } from '::app/menus/select-file';
import { Document } from '::lazy-components/index';
import { hotKeysManager, setupDevHotKeys } from '::helpers/hotkeys';
import { Void } from '::shared-components/suspense-fallback/void';

const Body = ({
  state,
  treeRef,
  dispatch,
  onResize,
}: {
  state;
  treeRef;
  dispatch;
  onResize;
}) => {
  const history = useHistory();
  return (
    <ApolloProvider client={client}>
      {!state.selectedFile && history.location.pathname === '/' ? (
        <p>no file selected</p>
      ) : (
        <Route
          path={`/:file_id?/`}
          render={() => (
            <Suspense fallback={<Void />}>
              <Document
                dispatch={dispatch}
                onResize={onResize}
                treeRef={treeRef}
                state={state}
                // showTree={state.showTree}
                // selectedNode={state.selectedNode}
                // recentNodes={state.recentNodes}
                // selectedFile={state.selectedFile}
                // saveDocument={state.saveDocument}
                // reloadDocument={state.reloadDocument}
                // contentEditable={state.contentEditable}
              />
            </Suspense>
          )}
        />
      )}
      {state.showFileSelect && (
        <SelectFile selectedFile={state.selectedFile} dispatch={dispatch} />
      )}
    </ApolloProvider>
  );
};
export default Body;

setupDevHotKeys();
hotKeysManager.startListening();
