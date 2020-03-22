import { getSelection } from '::helpers/execK/steps/get-selection';
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const getNodeId = () => /-(\d+)$/.exec(document.location.pathname)[1];

const createTestSample = () => {
  const { startOffset, endElement, startElement, endOffset } = getSelection();
  startElement.setAttribute('start-element', true);
  endElement.setAttribute('end-element', true);
  const outerHTML = document.querySelector('#rich-text').outerHTML;

  const test = `
  const n${getNodeId()} = {
    meta:{name: 'node${getNodeId()}'},
    input:${JSON.stringify({ outerHTML, startOffset, endOffset })}
  }
  
  export { n${getNodeId()} }
  `;
  console.info('a test sample was copied to the clipboard');
  copyToClipboard(test);
};

export { createTestSample };
