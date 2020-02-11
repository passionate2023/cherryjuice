import toolbarMod from '::sass-modules/tool-bar.scss';
import cherries from '::assets/icons/cherries.svg';
import * as React from 'react';
import { appActions, TState } from '../reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faSave, faRedo } from '@fortawesome/free-solid-svg-icons';
import { getAHtml } from '::helpers/html-to-ctb';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  onResize: () => void;
  // serverSideHtml: boolean;
};

const ToolbarButton: React.FC<{ onClick: any; enabled?: boolean }> = ({
  onClick,
  children,
  enabled
}) => (
  <div
    className={`${toolbarMod.toolBar__icon} ${
      enabled ? toolbarMod.toolBar__iconEnabled : ''
    }`}
    onClick={onClick}
  >
    {children}
  </div>
);

const ToolBar: React.FC<Props> = ({ dispatch, onResize }) => {
  return (
    <div className={toolbarMod.toolBar}>
      <ToolbarButton
        onClick={() => {
          dispatch({ type: appActions.TOGGLE_TREE });
          setTimeout(onResize, 1000);
        }}
      >
        <img src={cherries} alt="" style={{ width: 22 }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          dispatch({ type: appActions.TOGGLE_FILE_SELECT });
        }}
      >
        <FontAwesomeIcon icon={faFolder} color={'grey'} />
      </ToolbarButton>
      <ToolbarButton
        onClick={e => {
          dispatch({
            type: appActions.SAVE_DOCUMENT,
            value: e.shiftKey
              ? new Date().getTime()
              : new Date().getTime() + '_' // don't send to the server
          });
        }}
      >
        <FontAwesomeIcon icon={faSave} color={'grey'} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          dispatch({
            type: appActions.RELOAD_DOCUMENT,
            value: new Date().getTime()
          });
        }}
      >
        <FontAwesomeIcon icon={faRedo} color={'grey'} />
      </ToolbarButton>
    </div>
  );
};

export { ToolBar };
