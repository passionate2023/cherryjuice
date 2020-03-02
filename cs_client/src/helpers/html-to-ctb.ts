const getStyles = el =>
  (el.style.cssText.match(/([\w\-]+)(?=:)/g) || []).reduce(
    (acc, key) => ({ ...acc, [key]: el.style[key] }),
    {}
  );

const getFlatList = containers => {
  // @ts-ignore
  const flatList = containers.flatMap(el => [
    ...Array.from(el.childNodes),
    document.createElement('br')
  ]);
  flatList.pop();
  return flatList;
};

type TProps = {
  containers: Node[];
  options?: {
    useObjForTextNodes?: boolean;
    includeDatasetInTextElements?: boolean;
    includeRefToEl?: boolean;
  };
};

const getAHtml = ({ containers, options = {} }: TProps) => {
  const flatList = getFlatList(containers);
  const state = { offset: 0 };
  const abstractHtml = flatList.reduce((acc, el) => {
    console.log(el);
    if (el.nodeType === 1 || el.nodeType === 3) {
      if (el.localName === 'br') {
        acc.push('\n');
        state.offset += 1;
      } else {
        let res =
          el.nodeType === 1
            ? {
                $: getStyles(el),
                tags: [
                  el.localName,
                  ...Array.from(el.children).map(({ localName }) => localName)
                ]
              }
            : {};
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
        } else if (el.nodeType === 3) {
          state.offset += el.wholeText.length;
          if (options.useObjForTextNodes) {
            acc.push({
              _: el.wholeText,
              ...res,
              ...(options.includeDatasetInTextElements && {
                dataset: el.parentNode.dataset
              })
            });
          } else {
            acc.push(el.wholeText);
          }
        } else {
          state.offset += el.textContent.length;
          acc.push({
            _: el.textContent,
            ...res,
            ...(options.includeDatasetInTextElements && {
              dataset: el.dataset
            }),
          });
        }
      }
    }
    return acc;
  }, []);
  return { abstractHtml: JSON.stringify(abstractHtml), flatList };
};

export { getAHtml };
