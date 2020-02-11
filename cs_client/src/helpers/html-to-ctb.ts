const getStyles = el =>
  (el.style.cssText.match(/([\w\-]+)(?=:)/g) || []).reduce(
    (acc, key) => ({ ...acc, [key]: el.style[key] }),
    {}
  );

const getAHtml = () => {
  const state = { offset: 0 };
  const doc = Array.from(
    document.querySelectorAll('#rich-text > article > div')
    // @ts-ignore
  ).flatMap(el => [
    ...Array.from(el.childNodes),
    document.createElement('br')
  ]); /*Array.from(
    document.querySelector('#rich-text').childNodes
    // @ts-ignore
  ).flatMap(el => [...Array.from(el.childNodes), document.createElement('br')]);*/
  doc.pop();
  const abstractHtml = doc.reduce((acc, el) => {
    if (el.nodeType === 3) {
      acc.push(el.wholeText);
      state.offset += el.wholeText.length;
    } else if (el.nodeType === 1) {
      if (el.localName === 'br') {
        acc.push('\n');
        state.offset += 1;
      } else {
        let res = {
          $: getStyles(el),
          tags: [
            el.localName,
            ...Array.from(el.children).map(({ localName }) => localName)
          ]
        };
        if (el.localName === 'code')
          acc.push({
            ...res,
            type: 'code',
            _: el.innerText,
            other_attributes: {
              offset: state.offset++,
              do_highl_bra: +el.dataset.do_highl_bra,
              is_width_pix: +el.dataset.is_width_pix,
              width_raw: +el.dataset.width_raw,
              syntax: el.dataset.syntax
            }
          });
        else if (el.localName === 'img')
          if (el.dataset)
            // existing image
            acc.push({
              type: 'png',
              ...res,
              other_attributes: {
                offset: state.offset++
              }
            });
          // new image
          else
            acc.push({
              type: 'png',
              ...res,
              src: el.src,
              other_attributes: {
                offset: state.offset++
              }
            });
        else if (el.localName === 'table')
          acc.push({
            type: 'table',
            ...res,
            thead: el.tHead.innerText,
            tbody: el.tBodies[0].innerText,
            tags: ['table'],
            other_attributes: {
              offset: state.offset++,
              col_min_width: +el.dataset.col_min_width,
              col_max_width: +el.dataset.col_max_width
            }
          });
        else if (el.localName === 'a') {
          state.offset += el.innerText.length;
          acc.push({
            ...res,
            _: el.innerText,
            other_attributes: {
              type: el.dataset.type,
              href: el.href
            }
          });
        } else {
          state.offset += el.textContent.length;
          acc.push({
            _: el.textContent,
            ...res
          });
        }
      }
    }
    return acc;
  }, []);
  return { abstractHtml: JSON.stringify(abstractHtml), doc };
};
// clear();
// console.time('extracting');
// const { doc, res } = getAHtml();
// console.timeEnd('extracting');
// console.log(doc);
// console.log(JSON.stringify(res, null, 4));
export { getAHtml };
