import * as React from 'react';
import { NodePrivacy, Privacy } from '@cherryjuice/graphql-types';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { privacyIsBelow } from '::root/components/app/components/menus/dialogs/document-meta/components/select-privacy/select-privacy';
import { VisibilityIcon } from '::root/components/app/components/editor/info-bar/components/components/visibility-icon';
import { memo } from 'react';
import { modNode } from '::sass-modules';

export type NodeVisibilityProps = {
  documentPrivacy: Privacy;
  privacy: NodePrivacy;
  parentPrivacy: NodePrivacy;
};

const NodeVisibility: React.FC<NodeVisibilityProps> = memo(
  function NodeVisibilityIcon({ documentPrivacy, privacy, parentPrivacy }) {
    const b = privacyIsBelow(parentPrivacy)(
      !privacy || privacy === NodePrivacy.DEFAULT ? documentPrivacy : privacy,
    );
    return (
      documentPrivacy !== Privacy.PRIVATE &&
      privacy !== NodePrivacy.PRIVATE && (
        <VisibilityIcon
          privacy={
            privacy && privacy !== NodePrivacy.DEFAULT
              ? privacy
              : documentPrivacy
          }
          className={joinClassNames([
            modNode.node__titlePrivacy,
            [modNode.node__titlePrivacyDisabled, b],
          ])}
          numberOfGuests={0}
          showTooltip={false}
        />
      )
    );
  },
);

export { NodeVisibility };
