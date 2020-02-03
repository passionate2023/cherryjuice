{
  clear();
  const getStyles = el =>
    (el.style.cssText.match(/([\w\-]+)(?=:)/g) || []).reduce(
      (acc, key) => ({ ...acc, [key]: el.style[key] }),
      {}
    );
  // Object.fromEntries(
  //   Object.entries(el.style).filter(([key, val]) => val && isNaN(key))
  // );
  console.time('extracting');
  const state = { offset: 0 };
  const doc = Array.from(
    document.querySelector('#rich-text').childNodes
  ).flatMap(el => [...Array.from(el.childNodes), document.createElement('br')]);
  const res = doc.reduce(
    (acc, el) => {
      if (el.nodeType === 3) {
        acc.nodes.push(el.wholeText);
        state.offset += el.wholeText.length;
      } else if (el.nodeType === 1) {
        if (el.localName === 'br') {
          acc.nodes.push('\n');
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
            acc.nodes.push({
              type: 'code',
              ...res
            });
          if (el.localName === 'img')
            if (el.dataset)
              // existing image
              acc.nodes.push({
                type: 'png',
                ...res,
                dataset: el.dataset,
                offset: state.offset++
              });
            // new image
            else
              acc.nodes.push({
                type: 'png',
                ...res,
                src: el.src,
                offset: state.offset++
              });
          else if (el.localName === 'table')
            acc.nodes.push({
              type: 'table',
              ...res,
              thead: el.tHead.innerText,
              tbody: el.tBodies[0].innerText,
              tags: ['table'],
              offset: state.offset++
            });
          else if (el.localName === 'a') {
            state.offset += el.innerText.length;
            acc.nodes.push({
              ...res,
              _: el.innerText,
              other_attributes: {
                type: el.dataset.type,
                target: el.target,
                href: el.href
              }
            });
          } else {
            state.offset += el.innerText.length;
            acc.nodes.push({
              _: el.innerText,
              ...res
            });
          }
        }
      }
      return acc;
    },
    { nodes: [] }
  );

  console.timeEnd('extracting');
  // console.log(doc)
  console.log(JSON.stringify(res, null, 4));
}
