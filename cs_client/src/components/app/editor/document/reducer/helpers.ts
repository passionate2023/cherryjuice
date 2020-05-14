import { TEditedNode } from '::app/editor/document/reducer/initial-state';

const nodeHasUnsavedChanges = ({ new: isNew, deleted, edited }: TEditedNode) =>
  isNew || deleted || edited?.meta?.length || edited?.content;

export { nodeHasUnsavedChanges };
