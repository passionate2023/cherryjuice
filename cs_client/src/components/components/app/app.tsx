import * as React from 'react';
import { useEffect, Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { appModule } from '::sass-modules';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { router } from '::root/router/router';
import { useUpdateCssVariables } from '::root/components/app/hooks/update-css-variables';
import { useGetPreviousOperations } from '::root/components/app/components/menus/widgets/components/document-operations/hooks/get-previous-operations';
import { useGetActiveOperations } from '::root/components/app/components/menus/widgets/components/document-operations/hooks/get-active-operations';
import { dmTM } from '::store/ducks/cache/document-cache';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);

type Props = {};

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showTree: state.editor.showTree,
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
  documentId,
  showTree,
  treeWidth,
  showFormattingButtons,
  dockedDialog,
  isDocumentOwner,
  userId,
  searchDialogIsShown,
}) => {
  useUpdateCssVariables(
    isDocumentOwner,
    showFormattingButtons,
    showTree,
    treeWidth,
    searchDialogIsShown,
  );
  // useRefreshToken({ token });
  useEffect(() => {
    if (!userId && router.get.location.pathname === '/') {
      router.goto.signIn();
    }
  }, [userId, documentId, router.get.location.pathname]);
  useGetPreviousOperations();
  useGetActiveOperations(userId);
  useEffect(() => {
    dmTM.setCurrent('user');
  }, []);
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
