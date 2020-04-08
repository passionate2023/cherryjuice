import * as React from 'react';
import { Suspense } from 'react';
import { Void } from '::shared-components/suspense-fallback/void';
import { TState } from '::app/reducer';
const ErrorModal = React.lazy(() => import('::shared-components/error-modal'));
const Settings = React.lazy(() => import('::app/menus/settings'));
const SelectFile = React.lazy(() => import('::app/menus/select-file'));
type Props = { state: TState; dispatch: any };

const Menus: React.FC<Props> = ({ state, dispatch }) => {
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
        <ErrorModal error={state.error} />
      </Suspense>
    </>
  );
};

export default Menus;
