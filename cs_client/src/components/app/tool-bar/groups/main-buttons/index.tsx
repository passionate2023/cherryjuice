import cherries from '::assets/icons/cherries.svg';
import * as React from 'react';
import { useCallback } from 'react';
import {
  faFolder,
  faRedo,
  faSave,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { appActions } from '::app/reducer';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  onResize: () => void;
};

const useMainCallbacks = ({ dispatch, onResize }) => {
  const toggleSettings = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_SETTINGS });
  }, []);
  const toggleFileSelect = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_FILE_SELECT });
  }, []);
  const toggleTree = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_TREE });
    setTimeout(onResize, 1000);
  }, []);
  const saveDocument = useCallback(e => {
    dispatch({
      type: appActions.SAVE_DOCUMENT,
      value: e.shiftKey ? new Date().getTime() : new Date().getTime() + '_', // don't send to the server
    });
  }, []);
  const reloadDocument = useCallback(() => {
    dispatch({
      type: appActions.RELOAD_DOCUMENT,
      value: new Date().getTime(),
    });
  }, []);
  return {
    toggleFileSelect,
    toggleTree,
    saveDocument,
    reloadDocument,
    toggleSettings,
  };
};
const MainButtons: React.FC<Props> = ({ dispatch, onResize }) => {
  const {
    toggleFileSelect,
    toggleTree,
    saveDocument,
    reloadDocument,
    toggleSettings,
  } = useMainCallbacks({ dispatch, onResize });
  return (
    <>
      <ToolbarButton
        onClick={toggleSettings}
        fontAwesomeProps={{ icon: faCogs, color: 'grey' }}
      ></ToolbarButton>
      <ToolbarButton
        onClick={toggleFileSelect}
        fontAwesomeProps={{ icon: faFolder, color: 'grey' }}
      />
      <ToolbarButton onClick={toggleTree}>
        <img src={cherries} alt="" style={{ width: 22 }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={saveDocument}
        fontAwesomeProps={{ icon: faSave, color: 'grey' }}
      />
      <ToolbarButton
        onClick={reloadDocument}
        fontAwesomeProps={{ icon: faRedo, color: 'grey' }}
      />
    </>
  );
};

export { MainButtons };
