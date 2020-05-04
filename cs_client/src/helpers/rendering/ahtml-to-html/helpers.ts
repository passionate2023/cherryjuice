import { Element } from '::helpers/rendering/ahtml-to-html/element';

const aHtmlToElement = ( node ) =>
  node.type ? node.outerHTML : Element(node);

export { aHtmlToElement };
