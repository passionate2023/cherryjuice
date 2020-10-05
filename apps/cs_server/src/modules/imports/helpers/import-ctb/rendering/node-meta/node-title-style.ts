const nodeTitleHelpers = {
  hasForground: is_richtxt => (is_richtxt >> 2) & 0x01,

  isBold: is_richtxt => (is_richtxt >> 1) & 0x01,
  customIconId: is_ro => is_ro >> 1,
  rgb_str_from_int24bit: int24bit => {
    const r = (int24bit >> 16) & 0xff;
    const g = (int24bit >> 8) & 0xff;
    const b = int24bit & 0xff;
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

const nodeTitleStyle = ({
  is_richtxt,
  is_ro,
}: {
  is_richtxt: number;
  is_ro: number;
}) => {
  const style: {
    color?: string;
    fontWeight?: string;
    icon_id?: number;
  } = {};
  const hasCustomColor = nodeTitleHelpers.hasForground(is_richtxt);
  if (hasCustomColor)
    style.color = nodeTitleHelpers.rgb_str_from_int24bit(
      (is_richtxt >> 3) & 0xffffff,
    );
  const isBold = nodeTitleHelpers.isBold(is_richtxt);
  if (isBold) style.fontWeight = 'bold';

  const customIconId = nodeTitleHelpers.customIconId(is_ro);
  if (customIconId) style.icon_id = customIconId;
  return hasCustomColor || customIconId || isBold
    ? JSON.stringify(style)
    : undefined;
};

export { nodeTitleStyle };
