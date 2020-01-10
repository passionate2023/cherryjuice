const helpers = {
  flagGhostNewLines: xmlString =>
    xmlString.replace(
      /(<rich_text[\w"= #]+)>(\s*\n\s*<\/rich_text>)/g,
      '$1 containsNewLine="true" >$2'
    ),
  replaceTabCharacter: xmlString => xmlString.replace(/\\t/g, '\u00A0 \u00A0 '),
  replaceSpaceCharacter: xmlString => xmlString.replace(/ {2}/g, '\u00A0 '),
  fillGhostNewLines: (xml: any) =>
    xml.map(node => {
      if (typeof node === 'object') {
        if (node.$.containsNewLine) {
          node = '\n';
        }
      }
      return node;
    })
};

export { helpers as fixCharacters };
