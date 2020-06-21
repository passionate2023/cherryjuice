export const getTreeInDom = ({ document, tree }) => {
  const treeElement = document.querySelector('.tree');
  const nOfLevels = tree.filter(level => Boolean(level.length)).length;
  return Array.from({ length: nOfLevels })
    .map(
      (_, i) =>
        'div>' +
        Array.from({ length: i + 1 })
          .map(() => 'ul>')
          .join('') +
        'div',
    )
    .map(sel => Array.from(treeElement.querySelectorAll(sel)));
};
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value',
).set;

export const setColorInputValue = ({ input, color }) => {
  nativeInputValueSetter.call(input, color);
  input.dispatchEvent(new Event('change', { value: color, bubbles: true }));
};

export const getElementPath = (el, boundingParentClassName) => {
  const path = [];
  while (
    el.nodeType === Node.ELEMENT_NODE &&
    !el.classList.contains(boundingParentClassName)
  ) {
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += '#' + el.id;
    } else {
      let sib = el,
        nth = 1;
      while (
        sib.nodeType === Node.ELEMENT_NODE &&
        (sib = sib.previousSibling) &&
        nth++
      );
      selector += ':nth-child(' + nth + ')';
    }
    path.unshift(selector);
    el = el.parentNode;
  }
  return path.join(' > ');
};