import { NodeMeta } from '::app/components/menus/dialogs/node-meta/reducer/reducer';

export const stringifyNodeStyle = ({
  customColor,
  customIcon,
  isBold,
}: NodeMeta): string => {
  const hasColor = customColor && customColor !== '#ffffff';
  const hasFontWeight = isBold;
  const hasIcon = typeof customIcon === 'number' && customIcon > 0;
  const newStyle = JSON.stringify({
    ...(hasColor && {
      color: customColor,
    }),
    ...(hasFontWeight && { fontWeight: 'bold' }),
    ...(hasIcon && {
      icon_id: customIcon,
    }),
  });
  return newStyle === '{}' ? undefined : newStyle;
};
