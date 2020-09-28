const compareTwoNodes = (a, b) => {
  if (a && b && a['_'] && b['_']) {
    const equalTags = a.tags.every(
      (tag, i) => JSON.stringify(tag) === JSON.stringify(b.tags[i]),
    );
    if (equalTags) {
      return true;
    }
  }
  return false;
};

export const mergeSimilarNodes = (current: {
  leftEdge: any;
  rightEdge: any;
  midNodes: any[];
}) => {
  const [leftEdge, ...midNodes] = [
    current.leftEdge,
    ...current.midNodes,
    current.rightEdge,
  ].reduce((acc, val) => {
    const previous = acc[acc.length - 1];
    if (compareTwoNodes(val, previous)) {
      previous._ += val._;
    } else acc.push(val);
    return acc;
  }, []);
  const rightEdge = midNodes.pop() || { _: '', tags: [] };
  return {
    leftEdge,
    midNodes,
    rightEdge,
  };
};
