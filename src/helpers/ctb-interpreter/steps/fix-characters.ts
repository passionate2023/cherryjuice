const helpers = {
  flagGhostNewLines: xmlString =>
    xmlString.replace(
      />(\s*\n\s*<\/rich_text>)/g,
      ' containsNewLine="true" >$1',
    ),
  replaceTabCharacter: xmlString => xmlString.replace(/\t/g, '\u00A0 \u00A0 '),
  replaceSpaceCharacter: xmlString => xmlString.replace(/ {2}/g, '\u00A0 '),
  fillGhostNewLines: (xml: any) =>
    xml.map(node => {
      if (typeof node === 'object') {
        if (node.$.containsNewLine) {
          node._ = '\n';
          delete node.$.containsNewLine;
        }
      }
      return node;
    }),
};

export {helpers as fixCharacters}