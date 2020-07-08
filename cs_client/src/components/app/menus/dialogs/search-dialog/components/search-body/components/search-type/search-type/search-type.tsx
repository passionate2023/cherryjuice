import * as React from 'react';
import { SearchType as TSearchType } from '::root/store/ducks/search';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { Type } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-type/search-type/components/type';

type Props = {};

const SearchType: React.FC<Props> = () => {
  const types: { type: TSearchType }[] = [
    { type: 'node-content' },
    { type: 'node-title' },
  ];

  return (
    <div className={joinClassNames([modSearchScope.searchScope])}>
      <span
        className={modSearchScope.searchScope__scopeList__scope__scopeLabel}
      >
        search type
      </span>
      <div className={modSearchScope.searchScope__scopeList}>
        {types.map(args => (
          <Type key={args.type} {...args} />
        ))}
      </div>
    </div>
  );
};

export { SearchType };
