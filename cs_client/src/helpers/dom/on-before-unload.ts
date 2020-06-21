const onBeforeUnload = (() => {
  const fn = event => {
    if (process.env.NODE_ENV === 'production') event.returnValue = '';
  };
  return {
    attach: () => {
      window.addEventListener('beforeunload', fn);
    },
    remove: () => {
      window.removeEventListener('beforeunload', fn);
    },
  };
})();

export { onBeforeUnload };
