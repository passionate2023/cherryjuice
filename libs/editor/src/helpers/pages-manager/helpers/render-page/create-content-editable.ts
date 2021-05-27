import { modEditor } from '::sass-modules';

export type PageProps = {
  nodeId: string;
  html: string;
  editable: boolean;
};
export const createContentEditable = ({
  html,
  nodeId,
  editable,
}: PageProps) => {
  return `
  <div 
    id="rich-text" 
    class="${modEditor.editor__contentEditable}" 
    data-node-id="${nodeId}"
    contenteditable="${editable}"
  >
  ${String(html)}
  </div>`;
};
