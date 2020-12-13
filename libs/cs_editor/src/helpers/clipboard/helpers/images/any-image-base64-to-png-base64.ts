export const anyImageBase64ToPngBase64 = (image: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas.toDataURL('image/png');
};
