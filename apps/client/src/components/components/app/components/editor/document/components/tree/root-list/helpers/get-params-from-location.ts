export const getParamsFromLocation = () => {
  const params = { expand: undefined };
  const expand = /expand=(\d+)/.exec(location.search);
  if (expand) {
    params.expand = expand[1];
  }
  return params;
};
