import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { appActionCreators, TState } from '::app/reducer';
import { AuthUser } from '::types/graphql/generated';
const AlertModal = React.lazy(() => import('./alert-modal/alert-modal'));
const UserPopup = React.lazy(() => import('./user/user'));
const ImportDocuments = React.lazy(() =>
  import('./import-documents/import-documents'),
);
const Settings = React.lazy(() => import('::app/menus/settings'));
const SelectFile = React.lazy(() => import('::app/menus/select-file'));
type Props = { state: TState; dispatch: any; session: AuthUser };



const Menus: React.FC<Props> = ({ state, dispatch, session: { user } }) => {
  return (
    <>
      <Suspense fallback={<Void />}>
        <SelectFile
          selectedFile={state.selectedFile}
          reloadFiles={state.reloadFiles}
          showDialog={state.showFileSelect}
          isOnMobile={state.isOnMobile}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Settings
          dispatch={dispatch}
          showDialog={state.showSettings}
          isOnMobile={state.isOnMobile}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <AlertModal
          alert={state.alert}
          show={Boolean(state.alert)}
          onClose={appActionCreators.clearAlert}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <ImportDocuments
          show={Boolean(state.showImportDocuments)}
          onClose={appActionCreators.toggleShowImportDocuments}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <UserPopup
          {...user}
          onClose={appActionCreators.toggleUserPopup}
          show={state.showUserPopup}
        />
      </Suspense>
    </>
  );
};

export default Menus;
