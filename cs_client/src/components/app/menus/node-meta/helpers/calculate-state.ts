import { NodeCached } from '::types/graphql/adapters';

const calculateState = (node: NodeCached) => {
  const { node_title_styles, read_only, name } = node;
  const style = JSON.parse(node_title_styles);
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
  };
};

export { calculateState };
