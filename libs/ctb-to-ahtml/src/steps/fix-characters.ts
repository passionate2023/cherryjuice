const fixCharacters = {
  flagOrphanWhiteSpace: xmlString =>
    xmlString.replace(
      /(<rich_text[\w"= #]+)>((\s+)<\/rich_text>)/g,
      '$1 containsWhiteSpace="$3" >$2',
    ),
  replaceTabCharacter: xmlString => xmlString.replace(/\\t/g, '\u00A0 \u00A0 '),
  replaceSpaceCharacter: xmlString => xmlString.replace(/ {2}/g, '\u00A0 '),

  restoreOrphanWhiteSpace: (xml: any) =>
    xml.map(node => {
      if (typeof node === 'object') {
        if (node.$.containsWhiteSpace) {
          node._ = node.$.containsWhiteSpace.replace(/ /g, '\u00A0');
          delete node.$.containsWhiteSpace;
        }
      }
      return node;
    }),
};

export { fixCharacters };
