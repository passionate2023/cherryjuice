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
    serializeNonTextElements?: boolean;
    // includeDatasetInTextElements?: boolean;
    // includeRefToEl?: boolean;
  };
};

const getAttributes = (ignoredAttributes: string[]) => el =>
  // @ts-ignore
  Object.fromEntries(
    Array.from(el.attributes)
      .filter(({ name }) => !ignoredAttributes.includes(name))
      .map(({ name, value }) => [
        name,
        name === 'style' ? getStyles(el) : value
      ])
  );

const getTags = (list = []) => el => [
  ...list,
  [el.localName, getAttributes([])(el)],
  ...(el.localName === 'table'
    ? []
    : Array.from(el.children).flatMap(getTags(list)))
];

const getParentAttributes = ({ parentElement }) => [
  ['span', getAttributes(['class'])(parentElement)]
];
const getAHtml = ({ containers, options = {} }: TProps) => {
  const flatList = getFlatList(containers);
  const state = { offset: 0 };
  const abstractHtml = (flatList as any[]).reduce((
    acc,
    el //: HTMLElement | HTMLTableElement | HTMLImageElement | HTMLAnchorElement
  ) => {
    if (el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.TEXT_NODE) {
      if (el.localName === 'br') {
        acc.push('\n');
        state.offset += 1;
      } else {
        let commonAttributes = {
          tags: el.nodeType === Node.ELEMENT_NODE ? getTags([])(el) : []
        };
        if (el.localName === 'code' && el.classList.contains('rich-text__code'))
          acc.push(
            options.serializeNonTextElements
              ? {
                  ...commonAttributes,
                  type: 'code',
                  outerHTML: el.outerHTML
                }
              : {
                  ...commonAttributes,
                  type: 'code',
                  _: el.innerText,
                  other_attributes: {
                    offset: state.offset++,
                    do_highl_bra: +el.dataset.do_highl_bra,
                    is_width_pix: +el.dataset.is_width_pix,
                    width_raw: +el.dataset.width_raw,
                    syntax: el.dataset.syntax
                  }
                }
          );
        else if (el.localName === 'img')
          if (el.dataset)
            // existing image
            acc.push(
              options.serializeNonTextElements
                ? {
                    ...commonAttributes,
                    type: 'png',
                    outerHTML: el.outerHTML
                  }
                : {
                    ...commonAttributes,
                    type: 'png',
                    other_attributes: {
                      offset: state.offset++
                    }
                  }
            );
          // new image
          else
            acc.push(
              options.serializeNonTextElements
                ? {
                    ...commonAttributes,
                    type: 'png',
                    outerHTML: el.outerHTML
                  }
                : {
                    ...commonAttributes,
                    type: 'png',
                    src: el.src,
                    other_attributes: {
                      offset: state.offset++
                    }
                  }
            );
        else if (el.localName === 'table')
          acc.push(
            options.serializeNonTextElements
              ? {
                  ...commonAttributes,
                  type: 'table',
                  outerHTML: el.outerHTML
                }
              : {
                  ...commonAttributes,
                  type: 'table',
                  thead: el.tHead.innerText,
                  tbody: el.tBodies[0].innerText,
                  other_attributes: {
                    offset: state.offset++,
                    col_min_width: +el.dataset.col_min_width,
                    col_max_width: +el.dataset.col_max_width
                  }
                }
          );
        else if (el.localName === 'a') {
          state.offset += el.innerText.length;
          acc.push({
            ...commonAttributes,
            _: el.innerText,
            other_attributes: {
              type: el.dataset.type,
              href: el.href
            }
          });
        } else if (el.nodeType === Node.TEXT_NODE) {
          state.offset += el.wholeText.length;
          console.log('pushing the element', el);
          if (options.useObjForTextNodes) {
            acc.push({
              ...commonAttributes,
              _: el.wholeText
            });
          } else {
            acc.push(el.wholeText);
          }
        } else {
          state.offset += el.textContent.length;
          acc.push({
            _: el.textContent,
            ...commonAttributes
          });
        }
      }
    }
    return acc;
  }, []);
  return { abstractHtml: JSON.stringify(abstractHtml), flatList };
};

export { getAHtml, getParentAttributes };
