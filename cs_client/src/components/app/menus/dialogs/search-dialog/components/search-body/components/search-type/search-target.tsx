import * as React from 'react';
import { SearchTarget as TSearchTarget } from '::types/graphql/generated';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { Target } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-type/components/target';

type Props = {};

const SearchTarget: React.FC<Props> = () => {
  const types: { target: TSearchTarget }[] = [
    { target: TSearchTarget.nodeContent },
    { target: TSearchTarget.nodeTitle },
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
          <Target key={args.target} {...args} />
        ))}
      </div>
    </div>
  );
};

export { SearchTarget };
