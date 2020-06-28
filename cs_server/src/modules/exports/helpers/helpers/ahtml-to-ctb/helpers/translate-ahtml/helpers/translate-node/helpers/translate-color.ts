const colorHelpers = {
  rgbToHex: color =>
    '#' +
    Array.from(color.matchAll(/\d+/g))
      .map(arr => +arr[0])
      .map(d => `${d.toString(16)}`.padStart(2, '0'))
      .join(''),
  isHex: color => color.startsWith('#'),
};
const translateColor = (color: string): string =>
  colorHelpers.isHex(color) ? color : colorHelpers.rgbToHex(color);
export { translateColor };
