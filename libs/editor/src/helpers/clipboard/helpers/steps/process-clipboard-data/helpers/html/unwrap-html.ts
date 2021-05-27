export const unwrapHtml = html => {
  if (html.startsWith('<HTML><HEAD></HEAD><BODY><!--StartFragment-->'))
    html = html.replace(
      /(<HTML><HEAD><\/HEAD><BODY><!--StartFragment-->|<!--EndFragment--><\/BODY><\/HTML>)/g,
      '',
    );
  return html;
};
