// const getParent = ({ nestLevel, element }) =>
//   nestLevel > 0
//     ? getParent({ nestLevel: nestLevel - 1, element: element.parentElement })
//     : element;

type TFilterEmptyNodes = (arr: HTMLElement[]) => HTMLElement[];
const filterEmptyNodes: TFilterEmptyNodes = arr =>
  arr.filter(
    el =>
      Boolean(el.innerText) ||
      ['img', 'br'].some(whiteListedTag =>
        Boolean(el.localName === whiteListedTag),
      ),
  );

type TReplaceElement = (
  el: Node,
  doFilterEmptyNodes?: boolean,
) => (arr: Element[]) => void;
const replaceElement: TReplaceElement = (
  el,
  doFilterEmptyNodes = true,
) => arr => {
  // @ts-ignore
  const elementsTobePlaced = doFilterEmptyNodes ? filterEmptyNodes(arr) : arr;
  // @ts-ignore
  el.replaceWith(...elementsTobePlaced);
  return elementsTobePlaced;
};

export { replaceElement };
