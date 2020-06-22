const hexColorToTripleHexPairs = (hexColor): string[] => {
  if (!/#(..)(..)(..)/.test(hexColor)) return [];
  const reg = /#(..)(..)(..)/.exec(hexColor);
  return [reg[1], reg[2], reg[3]].map(hex => '0x' + hex);
};

type CTStyle = { is_ro: number; is_richtxt: number };
const adaptNodeStyle = (
  csStyle = '{}',
  is_ro = false,
  is_richtxt = true,
): CTStyle => {
  const style: {
    fontWeight?: string;
    color?: string;
    icon_id?: number;
  } = JSON.parse(csStyle);
  const ctStyle: CTStyle = { is_richtxt: 0, is_ro: 0 };
  const hexPairs = hexColorToTripleHexPairs(style.color);
  ctStyle.is_richtxt =
    ((style.color
      ? +hexPairs[2] + (+hexPairs[1] << 8) + (+hexPairs[0] << 16)
      : 0) <<
      3) +
    ((style.color && style.color !== '#ffffff' ? 1 : 0) << 2) +
    ((style.fontWeight === 'bold' ? 1 : 0) << 1) +
    (is_richtxt ? 1 : 0);
  ctStyle.is_ro = (style.icon_id << 1) + (is_ro ? 1 : 0);
  return ctStyle;
};

const adaptNodeTime = (time: Date) => time.getTime() / 1000;

export { adaptNodeStyle, adaptNodeTime };
