import * as React from 'react';
import { QNodeMeta } from '::graphql/queries/document-meta';
import { modInfoBar } from '::sass-modules';
import { Separator } from './separator';
import { Time, useRelativeTime } from '::hooks/relative-time/relative-time';
import { Tooltip } from '@cherryjuice/components';

export const Timestamp: React.FC<
  Time & { created?: boolean; className?: string }
> = ({ created, absolute, relative, className }) => (
  <Tooltip tooltip={absolute}>
    {bind => (
      <span className={className} {...bind}>
        {created ? 'Created ' : 'Updated '}
        {relative}
      </span>
    )}
  </Tooltip>
);
const Timestamps: React.FC<{ node: QNodeMeta }> = ({ node }) => {
  const createdAt = useRelativeTime({ time: node.createdAt });
  const updatedAt = useRelativeTime({ time: node.updatedAt });
  return (
    <div className={modInfoBar.infoBar__timestamp}>
      {createdAt.relative && <Timestamp {...createdAt} created={true} />}
      {createdAt.relative && <Separator />}
      {updatedAt.relative && <Timestamp {...updatedAt} />}
    </div>
  );
};

export { Timestamps };
