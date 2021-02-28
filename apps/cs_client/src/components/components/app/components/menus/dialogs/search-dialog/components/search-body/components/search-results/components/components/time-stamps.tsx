import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modSearchResult } from '::sass-modules';
import { useRelativeTime } from '::hooks/relative-time/relative-time';
import { Timestamp } from '::app/components/editor/info-bar/components/components/timestamp';

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
      <Timestamp
        created={true}
        {..._createdAt}
        className={modSearchResult.searchResult__timestamps__item}
      />
      <span
        className={joinClassNames([
          modSearchResult.searchResult__timestamps__separator,
        ])}
      >
        -
      </span>
      <Timestamp
        {..._updatedAt}
        className={modSearchResult.searchResult__timestamps__item}
      />
    </span>
  );
};

export { TimeStamps };
