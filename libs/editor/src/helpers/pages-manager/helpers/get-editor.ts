export const getEditor = (id?: string): HTMLDivElement =>
  id
    ? (document.querySelector(`[data-node-id="${id}"`) as HTMLDivElement)
    : (document.querySelector('#editor')
        ?.firstElementChild as HTMLDivElement) ||
      (document.querySelector('#rich-text') as HTMLDivElement);

export const getEditorContainer = (): HTMLDivElement =>
  document.querySelector('#editor');
