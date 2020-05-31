export const randomBoolean = () => Math.floor(Math.random() * 10) < 5;
export const randomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// https://stackoverflow.com/a/1484514/6549728
export const randomHexColor = () => {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const randomRgbColor = () => {
  const [r, g, b] = Array.from({ length: 3 }).map(() => randomInteger(0, 255));
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbToHex = color =>
  '#' +
  Array.from(color.matchAll(/\d+/g))
    .map(arr => +arr[0])
    .map(d => `${d.toString(16)}`.padStart(2, '0'))
    .join('');

export const randomArrayElement = arr => arr[randomInteger(0, arr.length - 1)];
export const removeArrayElement = (arr, el) => arr.splice(arr.indexOf(el), 1);
