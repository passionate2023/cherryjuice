import { useMemo } from 'react';
import {
  FormattingButtonCategory,
  formattingHotkeysProps,
} from '::helpers/hotkeys/props/formatting-props';
import { HotKey } from '@cherryjuice/graphql-types';

export const useSortFormattingButtons = (hotkeys: HotKey[]) => {
  return useMemo(
    () =>
      hotkeys.reduce(
        (categories, hotKey) => {
          const props = formattingHotkeysProps[hotKey.type];
          if (props?.category) categories[props.category].push([hotKey, props]);
          return categories;
        },
        {
          [FormattingButtonCategory.primary]: [],
          [FormattingButtonCategory.secondary]: [],
          [FormattingButtonCategory.tertiary]: [],
          [FormattingButtonCategory.headers]: [],
          [FormattingButtonCategory.colors]: [],
          [FormattingButtonCategory.justification]: [],
        },
      ),
    [],
  );
};
