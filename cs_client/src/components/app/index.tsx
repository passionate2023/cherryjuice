import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { formattingBarUnmountAnimationDelay } from './editor/tool-bar/groups/formatting-buttons';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { appModule } from '::sass-modules/index';
import { useDocumentEditedIndicator } from '::app/hooks/document-edited-indicator';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { useHandleRouting } from '::app/hooks/handle-routing/handle-routing';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { isDocumentOwner } from '::root/store/selectors/document/is-document-owner';
import { router } from '::root/router/router';

const Menus = React.lazy(() => import('::app/menus'));
const Editor = React.lazy(() => import('::app/editor'));

type Props = {};

const updateBreakpointState = ({ breakpoint, callback }) => {
  let previousState = undefined;
  return () => {
    const newState = window.innerWidth <= breakpoint;
    if (previousState != newState) {
      previousState = newState;
      callback(newState);
    }
  };
};

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
  documentHasUnsavedChanges: state.document.hasUnsavedChanges,
  showFormattingButtons: state.editor.showFormattingButtons,
  dockedDialog: state.root.dockedDialog,
  isDocumentOwner: isDocumentOwner(state),
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
  useOnWindowResize([
    updateBreakpointState({
      breakpoint: 850,
      callback: ac.root.setIsOnMobile,
    }),
  ]);
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
      router.goto.login();
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
