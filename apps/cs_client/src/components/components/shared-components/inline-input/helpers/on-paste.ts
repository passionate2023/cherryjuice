export const putCursor = (element: HTMLElement, startOffset) => {
  try {
    const range = document.createRange();
    range.setStart(element.firstChild, startOffset);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
export const onPaste = e => {
  if (
    e &&
    e.clipboardData &&
    e.clipboardData.types &&
    e.clipboardData.getData
  ) {
    e.preventDefault();
    e.stopPropagation();
    const { clipboardData } = e;
    let text;
    if (clipboardData.types.includes('text/html')) {
      const pastedData = e.clipboardData.getData('text/html');
      const node = new DOMParser().parseFromString(pastedData, 'text/html');
      text = node.body.textContent;
    } else if (clipboardData.types.includes('text/plain')) {
      text = e.clipboardData.getData('text/plain');
    }
    if (text) {
      const target = e.target as HTMLInputElement;
      const currentText = target.innerText;

      const range = window.getSelection().getRangeAt(0);
      const firstHalf = currentText.substring(0, range.startOffset);
      const secondHalf = currentText.substring(range.endOffset);
      const newText = firstHalf + text + secondHalf;
      target.innerText = newText;
      putCursor(target, newText.length - secondHalf.length);
    }
  }
};
