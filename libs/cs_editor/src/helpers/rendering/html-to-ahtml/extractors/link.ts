import { LinkAttributes } from '@cherryjuice/ahtml-to-html';

export const extractLinkAttributes = (
  el: HTMLAnchorElement,
): LinkAttributes => {
  const type = el.dataset.type || 'web';
  return {
    'data-type': type,
    href: el.href.replace(/\/$/, ''),
    class: `rich-text__link ${type ? `rich-text__link--${type}` : ''}`,
    target: el.target || '_blank',
  };
};

const extractLink = (acc, el, tags, state) => {
  state.selectionContainsLinks = true;
  // state.offset += el.innerText.length;
  acc.push({
    ...tags,
    _: el.innerText,
    other_attributes: extractLinkAttributes(el),
  });
};

export { extractLink };
