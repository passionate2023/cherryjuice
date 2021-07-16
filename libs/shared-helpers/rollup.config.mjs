import { rollupConfig } from 'rollup-config';

export default {
  ...rollupConfig(),
  input: {
    index: 'src/index.ts',
    'clone-object': 'src/helpers/clone-object.ts',
    'create-gestures-handler': 'src/helpers/create-gestures-handler.ts',
    'make-promise-cancelable': 'src/helpers/make-promise-cancelable.ts',
    'extract-document-from-pathname':
      'src/helpers/extract-document-from-pathname.ts',
    'join-class-names': 'src/helpers/join-class-names.ts',
    'on-entered-viewport': 'src/helpers/on-entered-viewport.ts',
    'smooth-scroll-into-view': 'src/helpers/smooth-scroll-into-view.ts',
    'click-outside-modal': 'src/hooks/click-outside-modal.ts',
    loader: 'src/hooks/loader.ts',
    'debounced-event-handler': 'src/hooks/debounced-event-handler.ts',
    'lazy-auto-focus': 'src/hooks/lazy-auto-focus/lazy-auto-focus.ts',
    'modal-keyboard-events':
      'src/hooks/modal-keyboard-events/modal-keyboard-events.ts',
    'on-key-up': 'src/hooks/on-key-up.ts',
    'current-breakpoint': 'src/current-breakpoint.ts',
    'on-window-resize': 'src/on-window-resize.ts',
  },
};
