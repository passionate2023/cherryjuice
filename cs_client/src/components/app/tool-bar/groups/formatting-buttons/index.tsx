import cherries from '::assets/icons/cherries.svg';
import * as React from 'react';
import { useCallback } from 'react';
import { faFolder, faRedo, faSave } from '@fortawesome/free-solid-svg-icons';
import { appActions } from '::app/reducer';
import { ToolbarButton } from '::app/tool-bar/tool-bar-button';

type Props = {
  dispatch: (action: { type: string; value?: any }) => void;
  onResize: () => void;
};


const FormattingButtons: React.FC<Props> = ({ dispatch  }) => {

  return (
    <>
      <ToolbarButton onClick={()=>undefined}>
        <span>b</span>
      </ToolbarButton>

    </>
  );
};

export { FormattingButtons };
