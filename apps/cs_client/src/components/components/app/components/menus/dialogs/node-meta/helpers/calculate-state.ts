import { QNodeMeta } from '::graphql/queries/document-meta';
import { NodePrivacy } from '@cherryjuice/graphql-types';
import { splitTags } from '::app/components/menus/dialogs/search-dialog/components/search-body/components/search-results/components/components/node-tags';

export const jsonParse = <T = Record<string, any>>(
  json: string,
): T | undefined => {
  try {
    return JSON.parse(json);
    // eslint-disable-next-line no-empty
  } catch {}
};
type NodeContext = { nodeDepth: number };
const calculateState = (node: QNodeMeta, { nodeDepth }: NodeContext) => {
  const { node_title_styles, name, read_only } = node;
  const style = jsonParse(node_title_styles) || {};
  const isBold = style.fontWeight === 'bold';

  return {
    isBold,
    isReadOnly: Boolean(read_only),
    customIcon: style.icon_id,
    nodeDepth,
    customColor: style.color || '#ffffff',
    name,
    privacy: node.privacy || NodePrivacy.DEFAULT,
    tags: node.tags ? splitTags(node.tags) : [],
  };
};

export { calculateState };
