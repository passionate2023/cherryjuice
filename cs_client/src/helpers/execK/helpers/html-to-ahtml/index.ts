import { escapeHtml } from '::helpers/escape-html';
import { flattenAHtml } from '::helpers/execK/helpers/html-to-ahtml/steps/flatten-ahtml';
import { elementHasText } from '::helpers/execK/helpers';

const getStyles = el =>
  (el.style.cssText.match(/([\w-]+)(?=:)/g) || []).reduce(
    (acc, key) => ({ ...acc, [key]: el.style[key] }),
    {},
  );

type TProps = {
  DDOEs: Node[];
  options?: {
    useObjForTextNodes?: boolean;
    serializeNonTextElements?: boolean;
  };
};

const getAttributes = (ignoredAttributes: string[]) => el =>
  // @ts-ignore
  Object.fromEntries(
    Array.from(el.attributes)
      .filter(({ name }) => !ignoredAttributes.includes(name))
      .map(({ name, value }) => [
        name,
        name === 'style' ? getStyles(el) : value,
      ]),
  );

const getTags = (list = []) => el => [
  ...list,
  [el.localName, getAttributes([])(el)],
  ...(el.localName === 'table'
    ? []
    : Array.from(el.children).flatMap(getTags(list))),
];

const isBlock = (() => {
  const wb = document.createElement('div');
  document.body.appendChild(wb);
  wb.style.visibility = 'hidden';
  return el => {
    wb.appendChild(el);
    const block = window.getComputedStyle(el).display;
    wb.removeChild(el);
    return block === 'block' || el.localName === 'br';
  };
})();
const flattenDDOEs = ({ DDOEs }) => {
  const flat = [];
  DDOEs.forEach(DDOE => {
    if (isBlock(DDOE)) flat.push(document.createElement('br'));
    const DDOEHasNoTextAndHasOnlyABreakLine =
      DDOE.childNodes.length === 1 && !elementHasText(DDOE);
    if (!DDOEHasNoTextAndHasOnlyABreakLine)
      Array.from(DDOE.childNodes).forEach(child => {
        flat.push(child);
      });
  });
  return flat;
};

const getAHtml = ({ DDOEs, options = {} }: TProps) => {
  const flatList = flattenDDOEs({ DDOEs }); //DDOEs.flatMap(DDOE => Array.from(DDOE.childNodes));
  const state = { offset: 0 };
  const abstractHtml = (flatList as any[]).reduce((
    acc,
    el, //: HTMLElement | HTMLTableElement | HTMLImageElement | HTMLAnchorElement
  ) => {
    if (el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.TEXT_NODE) {
      if (el.localName === 'br') {
        acc.push('\n');
        state.offset += 1;
      } else {
        let commonAttributes = {
          tags:
            el.nodeType === Node.ELEMENT_NODE
              ? getTags([])(el) //.filter(([tagName]) => tagName !== 'br')
              : [],
        };
        if (el.localName === 'code' && el.classList.contains('rich-text__code'))
          acc.push(
            options.serializeNonTextElements
              ? {
                  ...commonAttributes,
                  type: 'code',
                  outerHTML: el.outerHTML,
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
                    syntax: el.dataset.syntax,
                  },
                },
          );
        else if (el.localName === 'img')
          if (el.dataset)
            // existing image
            acc.push(
              options.serializeNonTextElements
                ? {
                    ...commonAttributes,
                    type: 'png',
                    outerHTML: el.outerHTML,
                  }
                : {
                    ...commonAttributes,
                    type: 'png',
                    other_attributes: {
                      offset: state.offset++,
                    },
                  },
            );
          // new image
          else
            acc.push(
              options.serializeNonTextElements
                ? {
                    ...commonAttributes,
                    type: 'png',
                    outerHTML: el.outerHTML,
                  }
                : {
                    ...commonAttributes,
                    type: 'png',
                    src: el.src,
                    other_attributes: {
                      offset: state.offset++,
                    },
                  },
            );
        else if (el.localName === 'table')
          acc.push(
            options.serializeNonTextElements
              ? {
                  ...commonAttributes,
                  type: 'table',
                  outerHTML: el.outerHTML,
                }
              : {
                  ...commonAttributes,
                  type: 'table',
                  thead: el.tHead.innerText,
                  tbody: el.tBodies[0].innerText,
                  other_attributes: {
                    offset: state.offset++,
                    col_min_width: +el.dataset.col_min_width,
                    col_max_width: +el.dataset.col_max_width,
                  },
                },
          );
        else if (el.localName === 'a') {
          state.offset += el.innerText.length;
          acc.push({
            ...commonAttributes,
            _: el.innerText,
            other_attributes: {
              type: el.dataset.type,
              href: el.href,
            },
          });
        } else if (el.nodeType === Node.TEXT_NODE) {
          state.offset += el.wholeText.length;
          if (options.useObjForTextNodes) {
            acc.push({
              ...commonAttributes,
              _: escapeHtml(el.wholeText),
            });
          } else {
            acc.push(escapeHtml(el.wholeText));
          }
        } else {
          const { numberOfNewLines, newAcc } = flattenAHtml({
            acc,
            aHtml: {
              _: escapeHtml(el.textContent),
              ...commonAttributes,
            },
          });
          acc = newAcc;
          state.offset += el.textContent.length + numberOfNewLines;
          // acc.push({
          //   _: el.textContent,
          //   ...commonAttributes
          // });
        }
      }
      // const insertedAHtml = acc[acc.length - 1];
      // if (insertedAHtml._)
      //   acc = replaceNewLineCharacterWithBreakLine(insertedAHtml, acc);
    }
    return acc;
  }, []);
  return { abstractHtml };
};

export { getAHtml };
