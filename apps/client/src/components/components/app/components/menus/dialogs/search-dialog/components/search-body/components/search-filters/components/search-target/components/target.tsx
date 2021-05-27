import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ac, Store } from '::store/store';
import { SearchTarget as TSearchTarget } from '@cherryjuice/graphql-types';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchFilter } from '::sass-modules';
import { ButtonSquare } from '@cherryjuice/components';
import { useCallback } from 'react';

const mapEnumToReadableText = (
  ogText: string,
  mode: 'all-lowercase' | 'cap-first-letter' = 'all-lowercase',
) => {
  const text = ogText
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
  if (mode === 'all-lowercase') {
    return text;
  } else {
    const [head, ...tail] = text;
    return head.toUpperCase() + tail.join('');
  }
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
    <div className={joinClassNames([modSearchFilter.searchFilter__list__item])}>
      <ButtonSquare
        text={mapEnumToReadableText(target)}
        onClick={setSearchTargetM}
        active={searchTarget.includes(target)}
      />
    </div>
  );
};

const _ = connector(Target);
export { _ as Target, mapEnumToReadableText };
