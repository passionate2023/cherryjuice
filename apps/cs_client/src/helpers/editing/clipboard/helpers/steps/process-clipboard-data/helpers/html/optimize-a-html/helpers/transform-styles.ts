export const transformStyles = val => {
  if (val.tags)
    val.tags = val.tags.reduce((acc, val) => {
      acc.push(val);
      if (val[1].style) {
        if (val[1].style['font-weight']) {
          if (val[1].style['font-weight'] > 500) acc.push(['strong', {}]);
          delete val[1].style['font-weight'];
        }
        if (val[1].style['font-style']) {
          if (val[1].style['font-style'] === 'italic') acc.push(['em', {}]);
          delete val[1].style['font-style'];
        }
      }
      return acc;
    }, []);

  return val;
};
