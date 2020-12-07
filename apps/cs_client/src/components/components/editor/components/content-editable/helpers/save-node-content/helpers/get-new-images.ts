import { getEditor } from '::editor/components/content-editable/hooks/attach-images-to-html';

export const getNewImages = ({
  newImageIDs,
  imageIDsInDom,
}: {
  newImageIDs: string[];
  imageIDsInDom: string[];
}) => {
  const editor = getEditor();
  return newImageIDs.reduce((acc, id) => {
    const imageInDom: HTMLImageElement = editor.querySelector(
      `img[data-id="${id}"]`,
    );
    if (!imageInDom?.src) throw new Error('image has no src');
    acc.push({
      id: imageInDom.getAttribute('data-id'),
      base64: imageInDom.src.substr(22),
      index: imageIDsInDom.indexOf(id),
    });
    return acc;
  }, []);
};
