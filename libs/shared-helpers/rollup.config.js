import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: {
    index: 'src/index.ts',
    'clone-object': 'src/helpers/clone-object.ts',
    'create-gestures-handler': 'src/helpers/create-gestures-handler.ts',
    'extract-document-from-pathname':
      'src/helpers/extract-document-from-pathname.ts',
    'join-class-names': 'src/helpers/join-class-names.ts',
    'on-entered-viewport': 'src/helpers/on-entered-viewport.ts',
    'smooth-scroll-into-view': 'src/helpers/smooth-scroll-into-view.ts',
    'click-outside-modal': 'src/hooks/click-outside-modal.ts',
    'debounced-event-handler': 'src/hooks/debounced-event-handler.ts',
    'lazy-auto-focus': 'src/hooks/lazy-auto-focus/lazy-auto-focus.ts',
    'modal-keyboard-events':
      'src/hooks/modal-keyboard-events/modal-keyboard-events.ts',
    'on-key-up': 'src/hooks/on-key-up.ts',
  },
  output: [
    {
      dir: 'build/cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      dir: 'build',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: '**/__tests__/**',
      clean: true,
    }),
    commonjs({
      include: ['../../node_modules/**', 'node_modules/**'],
    }),
  ],
};
