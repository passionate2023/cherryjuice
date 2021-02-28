import { assign, createMachine } from 'xstate';

export type SearchContext = {
  value: string;
  hideableInput: 'manual' | 'external' | 'never';
};

const setValue = assign<SearchContext, { value: string; type: string }>({
  value: (context, event) => event.value,
});

const clearValue = assign<SearchContext, { value: string; type: string }>({
  value: '',
});

export const searchMachine = createMachine<SearchContext>(
  {
    initial: 'visibility',
    context: {
      value: '',
      hideableInput: 'manual',
    },
    id: 'root',
    type: 'parallel',
    states: {
      visibility: {
        initial: 'init',
        states: {
          init: {
            always: [
              {
                target: 'hidden',
                cond: 'manuallyHiddenInput',
              },
              { target: 'visible' },
            ],
          },
          hidden: {
            on: {
              toggle: {
                target: 'visible',
                cond: 'manuallyHiddenInput',
              },
              show: {
                target: 'visible',
                cond: 'externallyHiddenInput',
              },
            },
            entry: 'clearValue',
          },
          visible: {
            on: {
              toggle: {
                target: 'hidden',
                cond: 'manuallyHiddenInput',
              },
              hide: {
                target: 'hidden',
                cond: 'externallyHiddenInput',
              },
            },
          },
        },
      },
      typing: {
        initial: 'enabled',
        states: {
          enabled: {
            on: {
              disable: 'disabled',
              change: {
                actions: 'setValue',
              },
              clear: {
                actions: 'clearValue',
              },
            },
          },
          disabled: {
            on: { enable: 'enabled' },
          },
        },
      },
    },
  },
  {
    actions: {
      setValue,
      clearValue,
    },
    guards: {
      manuallyHiddenInput: context => context.hideableInput === 'manual',
      externallyHiddenInput: context => context.hideableInput === 'external',
    },
  },
);
