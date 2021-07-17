export const toDataUrl = (svg: string) => {
  const mime = 'image/svg+xml';
  const buffer = Buffer.from(svg, 'utf-8');
  const encoded = buffer.toString('base64');
  return `data:${mime};base64,${encoded}`;
};
