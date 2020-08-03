import * as React from 'react';
import { QNodeMeta } from '::graphql/queries/document-meta';
import { formatTime } from '::helpers/time';
import { modInfoBar } from '::sass-modules';
import { Separator } from './separator';

const Timestamps: React.FC<{ node: QNodeMeta }> = ({ node }) => {
  return (
    <div className={modInfoBar.infoBar__timestamp}>
      <span>
        {'Date created: '}
        {formatTime(node.createdAt)}
      </span>
      <Separator />
      <span>
        {'Date modified: '} {formatTime(node.updatedAt)}
      </span>
    </div>
  );
};

export { Timestamps };
