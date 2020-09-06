import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { appModule } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { useUpdateCssVariables } from '::root/components/app/hooks/update-css-variables';
import { useGetPreviousOperations } from '::root/components/app/components/menus/widgets/components/document-operations/hooks/get-previous-operations';
import { useGetActiveOperations } from '::root/components/app/components/menus/widgets/components/document-operations/hooks/get-active-operations';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);

type Props = {};

const mapState = (state: Store) => ({
  showTree: state.editor.showTree,
  showRecentNodes: state.editor.showRecentNodesBar,
  treeWidth: state.editor.treeWidth,
  showFormattingButtons: state.editor.showFormattingButtons,
  dockedDialog: state.root.dockedDialog,
  isDocumentOwner: hasWriteAccessToDocument(state),
  userId: state.auth.user?.id,
  searchDialogIsShown:
    state.root.dockedDialog && state.search.searchState !== 'idle',
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<Props & PropsFromRedux> = ({
  showTree,
  treeWidth,
  showFormattingButtons,
  dockedDialog,
  isDocumentOwner,
  userId,
  searchDialogIsShown,
  showRecentNodes,
}) => {
  useUpdateCssVariables(
    isDocumentOwner,
    showFormattingButtons,
    showTree,
    treeWidth,
    searchDialogIsShown,
    showRecentNodes,
  );
  // useRefreshToken({ token });
  useGetPreviousOperations();
  useGetActiveOperations(userId);

  return (
    <div
      className={joinClassNames([
        appModule.app,
        [appModule.appDialogDocked, dockedDialog],
      ])}
    >
      <Suspense fallback={<Void />}>
        <Editor />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Menus />
      </Suspense>
    </div>
  );
};
const _ = connector(App);
export { _ as App };
