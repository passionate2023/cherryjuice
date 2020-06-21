import { NodeCached } from '::types/graphql/adapters';

const calculateState = (node: NodeCached) => {
  const { node_title_styles, read_only, name } = node;
  const style = JSON.parse(node_title_styles);
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = style.color !== ('#ffffff' || 'rgb(255, 255, 255)');
  const hasCustomIcon = +style.icon_id !== 0;
  return {
    isBold,
    hasCustomIcon,
    isReadOnly: Boolean(read_only),
    customIcon: style.icon_id || 0,
    hasCustomColor,
    customColor: style.color,
    name,
  };
};

export { calculateState };
