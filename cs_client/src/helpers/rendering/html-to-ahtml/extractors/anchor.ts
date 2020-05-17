const extractAnchor = (acc, el) => {
  acc.push({
    type: 'anchor',
    ...[el.getAttribute('id')]
      .filter(Boolean)
      .map(id => ({ other_attributes: { id } }))[0],
  });
};

export { extractAnchor };
