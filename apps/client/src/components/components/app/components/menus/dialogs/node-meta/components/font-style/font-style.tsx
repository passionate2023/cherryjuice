import * as React from 'react';
import mod from './font-style.scss';
import { nodeMetaActionCreators } from '::app/components/menus/dialogs/node-meta/reducer/reducer';
import { testIds } from '@cherryjuice/test-ids';
import { SquareToggle } from '::app/components/menus/dialogs/node-meta/components/square-toggle/square-toggle';
type Props = { isBold: boolean };
export const FontStyle: React.FC<Props> = ({ isBold }) => {
  return (
    <div className={mod.fontStyle}>
      <SquareToggle
        onClick={nodeMetaActionCreators.toggleBold}
        testId={testIds.nodeMeta__isBold}
        icon={'bold'}
        enabled={isBold}
      />
    </div>
  );
};
