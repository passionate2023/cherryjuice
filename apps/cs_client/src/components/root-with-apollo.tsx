import * as React from 'react';
import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '@cherryjuice/shared-styles/build/global/base.scss';
import '@cherryjuice/shared-styles/build/global/css-variables.scss';
import { useApolloClient } from '::graphql/client/hooks/apollo-client';
import { Route, Switch } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { App } from '::root/components/app/app';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { ac, Store } from '::store/store';
import { useRegisterHotKeys } from '::helpers/hotkeys/hooks/register-hot-keys';
import { useConsumeToken } from '::root/hooks/consume-token';
import { Auth } from '::root/components/auth/auth';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { useTrackDocumentChanges } from '::root/hooks/track-document-changes';
import { enablePatches } from 'immer';
import '::helpers/attach-test-callbacks';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';
import { documentHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { useRouterEffect } from '::root/components/app/components/editor/hooks/router-effect/router-effect';
import { useTasks } from '::root/hooks/tasks';
import { CssVariables } from '::store/ducks/css-variables';
import { setContextMenusAnchor } from '@cherryjuice/components';
import { modApp } from '::sass-modules';
setContextMenusAnchor('.' + modApp.app);
// eslint-disable-next-line node/no-extraneous-import
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
import modDarkTheme from '@cherryjuice/shared-styles/build/themes/dark-theme.scss';
const themes = {
  light: modTheme.lightTheme,
  dark: modDarkTheme.darkTheme,
};
enablePatches();

const mapState = (state: Store) => ({
  token: state.auth.token,
  online: state.root.online,
  userId: state.auth.user?.id,
  hotKeys: getHotkeys(state),
  document: getCurrentDocument(state),
  userHasUnsavedChanges: getDocumentsList(state).some(
    documentHasUnsavedChanges,
  ),
  theme: state.root.theme,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Root: React.FC<PropsFromRedux> = ({
  token,
  userId,
  hotKeys,
  document,
  userHasUnsavedChanges,
  online,
  theme,
}) => {
  const client = useApolloClient(token, userId);
  useOnWindowResize([
    (w, h) => {
      ac.cssVariables.set(CssVariables.vh, h);
      ac.cssVariables.set(CssVariables.vw, w);
    },
  ]);
  useRegisterHotKeys(hotKeys);
  useTrackDocumentChanges({
    userHasUnsavedChanges,
    documentName: document?.name,
    userId,
    online,
  });
  useConsumeToken({ userId });
  useRouterEffect();
  useTasks();
  return (
    <>
      <div className={themes[theme]}>
        {client && (
          <Switch>
            <Route path={'/auth'} component={Auth} />
            <Route path={'(/|/document/*|/documents/*)'} component={App} />
          </Switch>
        )}
      </div>
    </>
  );
};

export const RootWithApollo = connector(Root);
