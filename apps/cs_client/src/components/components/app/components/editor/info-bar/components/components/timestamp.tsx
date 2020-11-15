import * as React from 'react';
import { QNodeMeta } from '::graphql/queries/document-meta';
import { modInfoBar } from '::sass-modules';
import { Separator } from './separator';
import { useRelativeTime } from '::hooks/relative-time/relative-time';

const Timestamps: React.FC<{ node: QNodeMeta }> = ({ node }) => {
  const createdAt = useRelativeTime({ time: node.createdAt });
  const updatedAt = useRelativeTime({ time: node.updatedAt });
  return (
    <div className={modInfoBar.infoBar__timestamp}>
      {createdAt && (
        <span>
          {'Created '}
          {createdAt}
        </span>
      )}
      <Separator />
      <span>
        {'Updated '}
        {updatedAt && <span>{updatedAt}</span>}
      </span>
    </div>
  );
};

export { Timestamps };
