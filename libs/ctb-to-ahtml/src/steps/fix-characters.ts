export const NB_SPACE = '\u00A0';
export const DOUBLE_SPACE = NB_SPACE + NB_SPACE;
export const QUAD_SPACE = NB_SPACE + NB_SPACE + NB_SPACE + NB_SPACE;

const fixCharacters = {
  flagOrphanWhiteSpace: xmlString =>
    xmlString.replace(
      /(<rich_text[\w"= #]+)>((\s+)<\/rich_text>)/g,
      '$1 containsWhiteSpace="$3" >$2',
    ),
  replaceTabCharacter: xmlString => xmlString.replace(/\\t/g, QUAD_SPACE),
  replaceSpaceCharacter: xmlString => xmlString.replace(/ {2}/g, DOUBLE_SPACE),

  restoreOrphanWhiteSpace: (xml: any) =>
    xml.map(node => {
      if (typeof node === 'object') {
        if (node.$.containsWhiteSpace) {
          node._ = node.$.containsWhiteSpace.replace(/ {2}/g, DOUBLE_SPACE);
          delete node.$.containsWhiteSpace;
        }
      }
      return node;
    }),
};

export { fixCharacters };
