import modToolbar from '::sass-modules/tool-bar.scss';
import * as React from 'react';
import { MainButtons } from '::app/tool-bar/groups/main-buttons';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  r;
  onResize: () => void;
};

const ToolBar: React.FC<Props> = ({ dispatch, onResize }) => {
  return (
    <div className={modToolbar.toolBar}>
      <MainButtons dispatch={dispatch} onResize={onResize} />
    </div>
  );
};

export { ToolBar };
