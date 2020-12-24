import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { FormattingButtons } from '::root/app/components/toolbar/components/formatting-buttons/formatting-buttons';
import { UndoRedo } from '::root/app/components/toolbar/components/undo-redo/undo-redo';

type Props = {
  documentId: string;
};
export const Toolbar: React.FC<Props> = ({ documentId }: Props) => {
  return (
    <div className={modToolbar.toolBar}>
      <UndoRedo documentId={documentId} />
      <FormattingButtons />
    </div>
  );
};
