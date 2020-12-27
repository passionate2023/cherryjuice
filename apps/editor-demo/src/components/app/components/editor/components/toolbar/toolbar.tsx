import * as React from 'react';
import { modToolbar } from '::sass-modules';
import { FormattingButtons } from '::root/app/components/editor/components/toolbar/components/formatting-buttons/formatting-buttons';
import { UndoRedo } from '::root/app/components/editor/components/toolbar/components/undo-redo/undo-redo';
import { Separator } from '::root/app/components/editor/components/toolbar/components/separator';

type Props = {
  documentId: string;
};
export const Toolbar: React.FC<Props> = ({ documentId }: Props) => {
  return (
    <div className={modToolbar.toolBar}>
      <UndoRedo documentId={documentId} />
      <Separator />
      <FormattingButtons />
    </div>
  );
};
