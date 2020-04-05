import * as React from 'react';
import { useCallback } from 'react';
import { appActions } from '::app/reducer';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';
import { Icon, Icons } from '::shared-components/icon';
import { modToolbar } from '../../../../../assets/styles/modules';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  // onResize: () => void;
};

const useMainCallbacks = ({ dispatch }) => {
  const toggleSettings = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_SETTINGS });
  }, []);
  const toggleFileSelect = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_FILE_SELECT });
  }, []);
  const toggleTree = useCallback(() => {
    dispatch({ type: appActions.TOGGLE_TREE });
    // setTimeout(onResize, 1000);
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
const MainButtons: React.FC<Props> = ({ dispatch }) => {
  const {
    toggleFileSelect,
    toggleTree,
    saveDocument,
    reloadDocument,
    toggleSettings,
  } = useMainCallbacks({ dispatch });
  return (
    <div className={modToolbar.toolBar__group}>
      <ToolbarButton onClick={toggleTree}>
        {/*<img src={cherries} alt="" style={{ width: 22 }} />*/}
        <Icon
          name={Icons.cherrytree.additionalIcons.cherries}
          style={{ width: 22 }}
        />
      </ToolbarButton>
      <ToolbarButton onClick={toggleSettings}>
        <Icon name={Icons.material.settings} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={toggleFileSelect}>
        <Icon name={Icons.material.folder} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={saveDocument}>
        <Icon name={Icons.material.save} small={true} />
      </ToolbarButton>
      <ToolbarButton onClick={reloadDocument}>
        <Icon name={Icons.material.refresh} small={true} />
      </ToolbarButton>
    </div>
  );
};

export { MainButtons };
