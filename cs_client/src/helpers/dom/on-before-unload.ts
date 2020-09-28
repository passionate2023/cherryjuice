export type OnUnloadHandler = (e: BeforeUnloadEvent) => void;

const onBeforeUnload = (() => {
  const state = {
    handler: undefined,
  };
  return {
    attach: ({
      callbacks,
      showPrompt,
    }: {
      callbacks: OnUnloadHandler[];
      showPrompt: boolean;
    }) => {
      state.handler = (e: BeforeUnloadEvent) => {
        callbacks.forEach(callback => {
          callback(e);
        });
        if (showPrompt) e.returnValue = '';
      };
      window.addEventListener('beforeunload', state.handler);
    },
    remove: () => {
      window.removeEventListener('beforeunload', state.handler);
    },
  };
})();

export { onBeforeUnload };
