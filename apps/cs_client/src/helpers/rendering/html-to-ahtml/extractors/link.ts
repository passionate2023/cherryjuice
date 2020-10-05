const extractLink = (acc, el, tags, state) => {
  state.selectionContainsLinks = true;
  // state.offset += el.innerText.length;
  acc.push({
    ...tags,
    _: el.innerText,
    other_attributes: {
      'data-type': el.dataset.type,
      href: el.href,
      class: `rich-text__link ${
        el.dataset.type ? `rich-text__link--${el.dataset.type}` : ''
      }`,
      target: el.target,
    },
  });
};

export { extractLink };
