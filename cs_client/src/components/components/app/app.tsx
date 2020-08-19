import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, Suspense } from 'react';
import { Void } from '::root/components/shared-components/react/void';
import { formattingBarUnmountAnimationDelay } from './components/editor/tool-bar/components/groups/formatting-buttons/formatting-buttons';
import { appModule } from '::sass-modules';
import { useDocumentEditedIndicator } from '::root/components/app/hooks/document-edited-indicator';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { useHandleRouting } from '::root/components/app/hooks/handle-routing/handle-routing';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { hasWriteAccessToDocument } from '::store/selectors/document/has-write-access-to-document';
import { router } from '::root/router/router';
import { getDocumentHasUnsavedChanges } from '::store/selectors/cache/document/document';

const Menus = React.lazy(() =>
  import('::root/components/app/components/menus/menus'),
);
const Editor = React.lazy(() =>
  import('::root/components/app/components/editor/editor'),
);

type Props = {};

const useUpdateCssVariables = (
  isDocumentOwner: boolean,
  showFormattingButtons: boolean,
  showTree: boolean,
  treeWidth: number,
) => {
  useEffect(() => {
    cssVariables.setTreeWidth(showTree ? treeWidth : 0);
    if (isDocumentOwner && showFormattingButtons) {
      cssVariables.setFormattingBar(40);
    } else {
      (async () => {
        await formattingBarUnmountAnimationDelay();
        cssVariables.setFormattingBar(0);
      })();
    }
  }, [showFormattingButtons, showTree]);
};

// const useRefreshToken = ({ token }) => {
//   const [fetch, { data, error }] = useLazyQuery(QUERY_USER.query, {
//     fetchPolicy: 'network-only',
//   });
//   useEffect(() => {
//     if (token) fetch();
//   }, []);
//   useEffect(() => {
//     const session = QUERY_USER.path(data);
//     if (session) {
//       ac.auth.setSession(session);
//     } else if (error) {
//       ac.auth.clearSession();
//     }
//   }, [data, error]);
// };

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
  showTree: state.editor.showTree,
  treeWidth: state.editor.treeWidth,
  documentHasUnsavedChanges: getDocumentHasUnsavedChanges(state),
  showFormattingButtons: state.editor.showFormattingButtons,
  dockedDialog: state.root.dockedDialog,
  isDocumentOwner: hasWriteAccessToDocument(state),
  userId: state.auth.user?.id,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<Props & PropsFromRedux> = ({
  documentId,
  showTree,
  treeWidth,
  documentHasUnsavedChanges,
  showFormattingButtons,
  dockedDialog,
  isDocumentOwner,
  userId,
}) => {
  useDocumentEditedIndicator(documentHasUnsavedChanges);
  useHandleRouting(documentId);
  useUpdateCssVariables(
    isDocumentOwner,
    showFormattingButtons,
    showTree,
    treeWidth,
  );
  // useRefreshToken({ token });
  useEffect(() => {
    if (!userId && router.get.location.pathname === '/') {
      router.goto.signIn();
    }
  }, [userId, documentId, router.get.location.pathname]);
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
