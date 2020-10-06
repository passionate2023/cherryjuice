import { QNodeMeta } from '::graphql/queries/document-meta';
import { NodePrivacy } from '@cherryjuice/graphql-types';

export const jsonParse = <T = Record<string, any>>(
  json: string,
): T | undefined => {
  try {
    return JSON.parse(json);
    // eslint-disable-next-line no-empty
  } catch {}
};

const calculateState = (node: QNodeMeta) => {
  const { node_title_styles, name, read_only } = node;
  const style = jsonParse(node_title_styles) || {};
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = Boolean(
    style.color && style.color !== ('#ffffff' || 'rgb(255, 255, 255)'),
  );
  const hasCustomIcon = Boolean(style.icon_id && +style.icon_id !== 0);
  return {
    isBold,
    hasCustomIcon,
    isReadOnly: Boolean(read_only),
    customIcon: style.icon_id || 1,
    hasCustomColor,
    customColor: style.color || '#ffffff',
    name,
    privacy: node.privacy || NodePrivacy.DEFAULT,
  };
};

export { calculateState };
