import { extractLinkAttributes } from '::helpers/rendering/html-to-ahtml/extractors/link';
import { LinkAttributes } from '@cherryjuice/ctb-to-ahtml';

type AHtml = Record<string, any>;
const getStyles = el =>
  (el.style.cssText.match(/([\w-]+)(?=:)/g) || []).reduce(
    (acc, key) => ({ ...acc, [key]: el.style[key] }),
    {},
  );

const getAttributes = (ignoredAttributes: string[]) => el =>
  Object.fromEntries(
    Array.from(el.attributes)
      .filter(({ name }) => !ignoredAttributes.includes(name))
      .map(({ name, value }) => [
        name,
        name === 'style' ? getStyles(el) : value,
      ]),
  );

export type GetTagsState = {
  link_attributes?: LinkAttributes;
};
const getTags = (list = [], state: GetTagsState) => el => [
  ...list,
  [
    el.localName,
    el.localName === 'a'
      ? ((state.link_attributes = extractLinkAttributes(el)),
        getAttributes([])(el))
      : getAttributes([])(el),
  ],
  ...(el.localName === 'table'
    ? []
    : Array.from(el.children).flatMap(getTags(list, state))),
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

const reduceIntoLines = (AHtml: AHtml | string[]): AHtml[][] =>
  AHtml.reduce((acc, val) => {
    if (typeof val === 'string') acc.push([]);
    else acc[acc.length - 1].push(val);
    return acc;
  }, []);

export { reduceIntoLines, getStyles, getTags, getAttributes, isBlock };
