import * as React from 'react';
import mod from './hide-input.scss';
import { SearchButton } from '::shared-components/search-input/components/search-button/search-button';

type Props = {
  hideInput: () => void;
};

export const HideInput: React.FC<Props> = ({ hideInput }) => {
  return (
    <SearchButton
      className={mod.hideInput}
      onClick={hideInput}
      icon={'arrow-left'}
    />
  );
};
