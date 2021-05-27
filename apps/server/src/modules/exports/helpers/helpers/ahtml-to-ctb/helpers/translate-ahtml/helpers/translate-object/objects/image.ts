import { CTBObject } from '../translate-object';
import { translateLink } from '../../translate-node/helpers/translate-link';
import { CTJustification } from '../../translate-node/translate-node';
import { AHtmlObject } from '@cherryjuice/ahtml-to-html';

type ImageRow = {
  node_id: number;
  justification: CTJustification;
  offset: number;
  link?: string;
};

type UnloadedImageRow = ImageRow & { png: { id: string } };
type LoadedImageRow = ImageRow & { png: { id: string; buffer: Buffer } };

const extractImage = (
  node: AHtmlObject,
  node_id: number,
  justification: CTJustification,
): CTBObject => {
  const row: UnloadedImageRow = {
    node_id,
    justification,
    offset: 0,
    png: { id: node.other_attributes.id },
    ...('linkAttributes' in node && {
      link: translateLink(node.linkAttributes),
    }),
  };
  return {
    row,
    type: 'image',
  };
};

export { extractImage };
export { UnloadedImageRow, LoadedImageRow };
