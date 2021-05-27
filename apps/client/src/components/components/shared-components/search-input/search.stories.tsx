import * as React from 'react';
import { Search, SearchProps } from '::shared-components/search-input/search';
import { useState } from 'react';
// eslint-disable-next-line node/no-extraneous-import

const config = {
  title: 'search',
  argTypes: {
    placeholder: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    hideInput: {
      control: {
        type: 'boolean',
      },
    },
  },
};

const noop = () => undefined;

export const Full = ({
  placeholder,
  disabled,
  hideInput,
}: Partial<SearchProps>) => {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span>searching for [{value}]</span>
      hideable input: manual
      <Search
        placeholder={placeholder}
        initialValue={value}
        onChange={setValue}
        performSearch={noop}
        hideableInput={'manual'}
        disabled={disabled}
      />
      hideable input: never
      <Search
        placeholder={placeholder}
        initialValue={value}
        onChange={setValue}
        performSearch={noop}
        hideableInput={'never'}
        hideInput={hideInput}
        disabled={disabled}
      />
      hideable input: external
      <Search
        placeholder={placeholder}
        initialValue={value}
        onChange={setValue}
        performSearch={noop}
        hideableInput={'external'}
        hideInput={hideInput}
        disabled={disabled}
      />
    </div>
  );
};

export default config;
