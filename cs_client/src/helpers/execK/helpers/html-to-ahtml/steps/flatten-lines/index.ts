const splitElement = el =>
  Array.from(el.childNodes).map(child => {
    const clone = el.cloneNode();
    clone.innerHTML = '';
    clone.appendChild(child);
    return clone;
  });

const blockElements = [
  'address',
  'article',
  'aside',
  'blockquote',
  'details',
  'dialog',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5 ',
  'h6',
  'header',
  'hgroup',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'ul'
];

const isBlock = el =>
  blockElements.includes(el.localName) || el?.style?.display === 'block';

const mapper = el => {
  const children = [];
  const isBlockElement = el.nodeType === Node.ELEMENT_NODE && isBlock(el);
  const hasOneDirectChild = el.firstChild === el.lastChild;
  const isALine = el?.classList?.contains('rich-text__line');

  if (isALine) children.push(...el.childNodes);
  else if (hasOneDirectChild) children.push(el);
  else children.push(...splitElement(el));

  if (isBlockElement) children.push(document.createElement('br'));

  return children;
};
const flattenLines = lines => lines.flatMap(mapper);

export { flattenLines };
