import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchResult } from '::sass-modules';
import { useRelativeTime } from '::hooks/relative-time/relative-time';

type Props = {
  createdAt: number;
  updatedAt: number;
};

const TimeStamps: React.FC<Props> = ({ createdAt, updatedAt }) => {
  const _createdAt = useRelativeTime({ time: createdAt });
  const _updatedAt = useRelativeTime({ time: updatedAt });
  return (
    <span
      className={joinClassNames([modSearchResult.searchResult__timestamps])}
    >
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps__item,
        ])}
      >{`Created ${_createdAt}`}</span>
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps__separator,
        ])}
      >
        -
      </span>
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps__item,
        ])}
      >{`Updated ${_updatedAt}`}</span>
    </span>
  );
};

export { TimeStamps };
