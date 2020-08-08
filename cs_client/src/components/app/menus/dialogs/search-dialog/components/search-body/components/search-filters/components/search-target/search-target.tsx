import * as React from 'react';
import { SearchTarget as TSearchTarget } from '::types/graphql/generated';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchFilter } from '::sass-modules';
import { Target } from './components/target';

type Props = {};

const SearchTarget: React.FC<Props> = () => {
  const types: { target: TSearchTarget }[] = [
    { target: TSearchTarget.nodeContent },
    { target: TSearchTarget.nodeTitle },
  ];

  return (
    <div className={joinClassNames([modSearchFilter.searchFilter])}>
      <span className={modSearchFilter.searchFilter__label}>search type</span>
      <div className={modSearchFilter.searchFilter__list}>
        {types.map(args => (
          <Target key={args.target} {...args} />
        ))}
      </div>
    </div>
  );
};

export { SearchTarget };
