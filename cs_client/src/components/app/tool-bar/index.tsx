import toolbarMod from '::sass-modules/tool-bar.scss';
import cherries from '::assets/icons/cherries.svg';
import * as React from 'react';
import { appActions, TState } from '../reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faSave } from '@fortawesome/free-solid-svg-icons';
import { getPseudoHtml } from '::helpers/html-to-ctb';

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
        onClick={() => {
          dispatch({
            type: appActions.SAVE_DOCUMENT,
            value: new Date().getTime()
          });
        }}
      >
        <FontAwesomeIcon icon={faSave} color={'grey'} />
      </ToolbarButton>
    </div>
  );
};

export { ToolBar };
