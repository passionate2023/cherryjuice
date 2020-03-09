import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';

const getParent = ({ nestLevel, element }) =>
  nestLevel > 0
    ? getParent({ nestLevel: nestLevel - 1, element: element.parentElement })
    : element;

const aHtmlToElement = ({ node }) =>
  node.type ? node.outerHTML : Element({ node });

type TFilterEmptyNodes = (arr: HTMLElement[]) => HTMLElement[];
const filterEmptyNodes: TFilterEmptyNodes = arr =>
  arr.filter(
    el =>
      Boolean(el.innerText) ||
      ['img', 'br'].some(whiteListedTag =>
        Boolean(el.localName === whiteListedTag)
      )
  );

type TReplaceElement = (el: HTMLElement) => (arr: Element[]) => void;
const replaceElement: TReplaceElement = el => arr =>
  // @ts-ignore
  el.replaceWith(...filterEmptyNodes(arr));

export { replaceElement };
