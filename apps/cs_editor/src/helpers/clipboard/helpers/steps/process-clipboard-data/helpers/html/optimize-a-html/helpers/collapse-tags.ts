export const collapseTags = val => {
  if (val.tags)
    val.tags = val.tags.reduce((acc, val) => {
      const previousTagWithSameName = acc.findIndex(tag => tag[0] === val[0]); //acc[i - 1] && acc[i - 1][0] === val[0];
      if (previousTagWithSameName !== -1) {
        const styleOfPreviousTag = acc[previousTagWithSameName][1].style || {};
        const stylesOfCollapsedTag = val[1].style;
        acc[previousTagWithSameName][1].style = {
          ...styleOfPreviousTag,
          ...stylesOfCollapsedTag,
        };
      } else acc.push(val);
      return acc;
    }, []);

  return val;
};
