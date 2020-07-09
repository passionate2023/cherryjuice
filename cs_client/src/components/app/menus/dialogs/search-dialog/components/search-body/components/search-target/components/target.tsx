import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::root/store/store';
import { SearchTarget as TSearchTarget } from '::types/graphql/generated';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modSearchScope } from '::sass-modules/';
import { ButtonSquare } from '::shared-components/buttons/button-square/button-square';
import { useCallback } from 'react';

const mapScopeToLabel = (scope: string) => {
  return scope
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
};

const mapState = (state: Store) => ({
  searchTarget: state.search.searchTarget,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  target: TSearchTarget;
};

const Target: React.FC<Props & PropsFromRedux> = ({ target, searchTarget }) => {
  const setSearchTargetM = useCallback(() => {
    ac.search.setSearchTarget(target);
  }, []);
  return (
    <div
      className={joinClassNames([modSearchScope.searchScope__scopeList__scope])}
    >
      <ButtonSquare
        text={mapScopeToLabel(target)}
        onClick={setSearchTargetM}
        active={searchTarget.includes(target)}
      />
    </div>
  );
};

const _ = connector(Target);
export { _ as Target, mapScopeToLabel };
