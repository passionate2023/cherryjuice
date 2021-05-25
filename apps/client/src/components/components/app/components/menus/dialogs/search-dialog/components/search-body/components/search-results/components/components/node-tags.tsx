import * as React from 'react';
import { modSearchResult } from '::sass-modules';
export const splitTags = (tags: string): string[] =>
  tags
    ?.split(/,\s/)
    ?.map(tag => tag.trim())
    ?.filter(Boolean);

type Props = {
  tags?: string;
};

const NodeTags: React.FC<Props> = ({ tags }) => {
  return (
    <span className={modSearchResult.searchResult__location__nodeTags}>
      {splitTags(tags)?.map(tag => (
        <span key={tag}>#{tag}</span>
      ))}
    </span>
  );
};

export { NodeTags };
