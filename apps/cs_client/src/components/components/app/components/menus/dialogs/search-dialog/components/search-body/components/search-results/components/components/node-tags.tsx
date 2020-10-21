import * as React from 'react';
import { modSearchResult } from '::sass-modules';
import { splitTags } from '::root/components/app/components/menus/dialogs/node-meta/hooks/save/helpers/edit-node';

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
