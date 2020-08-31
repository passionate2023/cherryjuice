import * as React from 'react';
import { modUndoAction } from '::sass-modules';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { Icons } from '::root/components/shared-components/icon/icon';
import { ac, store } from '::store/store';

type Props = {};

const undoAction = () => {
  if (store.getState().dialogs.showDocumentList)
    ac.documentCache.undoDocumentMeta();
  else ac.documentCache.undoNodeMeta();
};
const redoAction = () => {
  if (store.getState().dialogs.showDocumentList)
    ac.documentCache.redoDocumentMeta();
  else ac.documentCache.redoNodeMeta();
};
const UndoAction: React.FC<Props> = () => {
  return (
    <div className={modUndoAction.undoAction}>
      <ButtonSquare
        className={modUndoAction.undoAction__button}
        iconName={Icons.material.undo}
        onClick={undoAction}
      />
      <ButtonSquare
        className={modUndoAction.undoAction__button}
        iconName={Icons.material.redo}
        onClick={redoAction}
      />
    </div>
  );
};

export { UndoAction };
