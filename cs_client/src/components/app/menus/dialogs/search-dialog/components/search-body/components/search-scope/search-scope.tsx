import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { Scope } from '::app/menus/dialogs/search-dialog/components/search-body/components/search-scope/components/scope';
import { SearchScope as TSearchScope } from '::root/store/ducks/search';

type Props = {};

const SearchScope: React.FC<Props> = () => {
  const scopes: { scope: TSearchScope }[] = [
    { scope: 'current-node' },
    { scope: 'child-nodes' },
    { scope: 'current-document' },
    { scope: 'all-documents' },
  ];

  return (
    <div className={joinClassNames([modSearchScope.searchScope])}>
      <span
        className={modSearchScope.searchScope__scopeList__scope__scopeLabel}
      >
        search scope
      </span>
      <div className={modSearchScope.searchScope__scopeList}>
        {scopes.map(args => (
          <Scope key={args.scope} {...args} />
        ))}
      </div>
    </div>
  );
};

export { SearchScope };
