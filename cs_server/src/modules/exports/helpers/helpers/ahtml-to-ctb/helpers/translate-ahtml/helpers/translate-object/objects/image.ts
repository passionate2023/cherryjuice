import { AHtmlObject, CTBObject } from '../translate-object';

type ImageRow = {
  node_id: number;
  justification: 'left';
  offset: number;
  link?: string;
};

type UnloadedImageRow = ImageRow & { png: { id: string } };
type LoadedImageRow = ImageRow & { png: { id: string; buffer: Buffer } };

const extractImage = (node: AHtmlObject, node_id: number): CTBObject => {
  const row: UnloadedImageRow = {
    node_id,
    justification: 'left',
    offset: 0,
    png: { id: node.other_attributes.id },
  };
  return {
    row,
    type: 'image',
  };
};

export { extractImage };
export { UnloadedImageRow, LoadedImageRow };
