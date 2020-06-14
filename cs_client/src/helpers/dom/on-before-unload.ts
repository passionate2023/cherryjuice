const onBeforeUnload = (() => {
  const fn = event => {
    event.returnValue = '';
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
