const isSingleLineFromWikipedia = (html: string) => {
  return /<!--StartFragment--><(span|a|b) /.test(html);
};

export const detectSources = {
  isSingleLineFromWikipedia,
};
