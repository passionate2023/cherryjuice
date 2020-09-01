import * as React from 'react';
import { modSnackbar } from '::sass-modules';
import { Icons } from '::root/components/shared-components/icon/icon';
import { ac } from '::store/store';
import { ButtonCircle } from '::root/components/shared-components/buttons/button-circle/button-circle';
import { NumberOfFrames } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  actionName: string;
  autoCloseDuration?: number;
  numberOfFrames: NumberOfFrames;
  redo: () => void;
  undo: () => void;
  hide: () => void;
};
const UndoAction: React.FC<Props> = ({
  autoCloseDuration = 2500,
  actionName,
  numberOfFrames,
  undo,
  redo,
  hide,
}) => {
  const [mouseIn, setMouseIn] = useState(false);
  const [interactionTS, setInteractionTS] = useState(0);
  useEffect(() => {
    if (!mouseIn) {
      const timer = setTimeout(() => {
        hide();
      }, autoCloseDuration);
      return () => {
        clearInterval(timer);
      };
    }
  }, [interactionTS, mouseIn]);
  const undoM = useCallback(() => {
    undo();
    setInteractionTS(Date.now());
  }, []);
  const redoM = useCallback(() => {
    redo();
    setInteractionTS(Date.now());
  }, []);
  return (
    <div
      className={modSnackbar.snackbar}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      <span className={modSnackbar.snackbar__message}>{actionName}</span>
      <div className={modSnackbar.snackbar__buttons}>
        <ButtonCircle
          iconName={Icons.material.undo}
          onClick={undoM}
          disabled={!numberOfFrames.undo}
        />
        <ButtonCircle
          iconName={Icons.material.redo}
          onClick={redoM}
          disabled={!numberOfFrames.redo}
        />
        <ButtonCircle
          key={Icons.material.delete}
          onClick={ac.timelines.hideUndoDocumentAction}
          iconName={Icons.material.clear}
        />
      </div>
    </div>
  );
};

export { UndoAction };
