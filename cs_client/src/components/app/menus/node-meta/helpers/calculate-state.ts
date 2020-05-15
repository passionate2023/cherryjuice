import { NodeCached } from '::types/graphql/adapters';

const calculateState = (node: NodeCached) => {
  const { node_title_styles, icon_id, read_only, name } = node;
  const style = JSON.parse(node_title_styles);
  const isBold = style.fontWeight === 'bold';
  const hasCustomColor = style.color !== ('#ffffff' || 'rgb(255, 255, 255)');
  const hasCustomIcon = +icon_id !== 0;

  return {
    isBold,
    hasCustomIcon,
    isReadOnly: Boolean(read_only),
    customIcon: icon_id,
    hasCustomColor,
    customColor: style.color,
    name,
  };
};

export { calculateState };
