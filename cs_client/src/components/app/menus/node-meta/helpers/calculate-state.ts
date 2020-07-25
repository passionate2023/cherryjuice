import { QNodeMeta } from '::graphql/queries/document-meta';

const calculateState = (node: QNodeMeta) => {
  const { node_title_styles, name } = node;
  const style = JSON.parse(node_title_styles) || {};
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = Boolean(
    style.color && style.color !== ('#ffffff' || 'rgb(255, 255, 255)'),
  );
  const hasCustomIcon = Boolean(style.icon_id && +style.icon_id !== 0);
  return {
    isBold,
    hasCustomIcon,
    isReadOnly: false,
    customIcon: style.icon_id || 1,
    hasCustomColor,
    customColor: style.color || '#ffffff',
    name,
    privacy: node.privacy,
  };
};

export { calculateState };
